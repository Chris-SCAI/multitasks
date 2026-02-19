import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// =============================================================================
// Rate Limiter en mémoire — compatible Edge Runtime (pas de dépendance Node.js)
// Algorithme : Sliding Window Counter
// =============================================================================

/** Entrée du compteur de fenêtre glissante */
interface RateLimitEntry {
  /** Nombre de requêtes dans la fenêtre précédente */
  previousCount: number;
  /** Nombre de requêtes dans la fenêtre courante */
  currentCount: number;
  /** Timestamp de début de la fenêtre courante (ms) */
  currentWindowStart: number;
}

/** Résultat de la vérification du rate limit */
interface RateLimitResult {
  /** true si la requête est autorisée */
  allowed: boolean;
  /** Nombre de requêtes restantes dans la fenêtre */
  remaining: number;
  /** Timestamp (ms) de réinitialisation de la fenêtre courante */
  resetAt: number;
}

/**
 * Store en mémoire pour le rate limiting.
 * Utilise un Map<string, RateLimitEntry> par limiteur.
 * Compatible Edge Runtime (pas de dépendance Node.js).
 */
class InMemoryRateLimiter {
  private readonly store: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  /** Compteur pour déclencher le nettoyage périodique */
  private cleanupCounter = 0;
  private static readonly CLEANUP_INTERVAL = 100;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Vérifie et enregistre une requête pour la clé donnée.
   * Algorithme sliding window : pondère les requêtes de la fenêtre précédente
   * par le temps restant dans la fenêtre courante.
   */
  check(key: string): RateLimitResult {
    const now = Date.now();
    const currentWindowStart =
      Math.floor(now / this.windowMs) * this.windowMs;

    let entry = this.store.get(key);

    if (!entry) {
      // Première requête pour cette clé
      entry = {
        previousCount: 0,
        currentCount: 1,
        currentWindowStart,
      };
      this.store.set(key, entry);
    } else if (entry.currentWindowStart !== currentWindowStart) {
      // Nouvelle fenêtre : rotation des compteurs
      if (currentWindowStart - entry.currentWindowStart <= this.windowMs) {
        // La fenêtre précédente est l'ancienne fenêtre courante
        entry.previousCount = entry.currentCount;
      } else {
        // Plus d'une fenêtre s'est écoulée, les anciennes données sont obsolètes
        entry.previousCount = 0;
      }
      entry.currentCount = 1;
      entry.currentWindowStart = currentWindowStart;
    } else {
      // Même fenêtre : incrémenter
      entry.currentCount += 1;
    }

    // Calcul du taux pondéré (sliding window)
    const elapsedInWindow = now - currentWindowStart;
    const weight = 1 - elapsedInWindow / this.windowMs;
    const estimatedCount =
      entry.previousCount * weight + entry.currentCount;

    const resetAt = currentWindowStart + this.windowMs;
    const remaining = Math.max(
      0,
      Math.floor(this.maxRequests - estimatedCount)
    );
    const allowed = estimatedCount <= this.maxRequests;

    // Nettoyage périodique des entrées expirées
    this.cleanupCounter += 1;
    if (this.cleanupCounter >= InMemoryRateLimiter.CLEANUP_INTERVAL) {
      this.cleanupCounter = 0;
      this.cleanup(now);
    }

    return { allowed, remaining, resetAt };
  }

  /** Supprime les entrées expirées (plus de 2 fenêtres d'âge) */
  private cleanup(now: number): void {
    const expirationThreshold = now - this.windowMs * 2;
    for (const [key, entry] of this.store) {
      if (entry.currentWindowStart < expirationThreshold) {
        this.store.delete(key);
      }
    }
  }

  /** Expose le nombre max de requêtes (pour les headers) */
  getMaxRequests(): number {
    return this.maxRequests;
  }
}

// =============================================================================
// Instances des rate limiters
// =============================================================================

/** Rate limiter global : 100 requêtes par minute par IP */
const globalLimiter = new InMemoryRateLimiter(100, 60_000);

/** Rate limiter auth : 20 requêtes par minute par IP */
const authLimiter = new InMemoryRateLimiter(20, 60_000);

// =============================================================================
// Helpers
// =============================================================================

/** Patterns des routes d'authentification soumises au rate limit renforcé */
const AUTH_ROUTE_PATTERNS: ReadonlyArray<RegExp> = [
  /^\/api\/auth(\/|$)/,
  /^\/(auth)(\/|$)/,
];

/** Vérifie si le chemin correspond à une route d'authentification */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

/** Routes protégées nécessitant une session */
const PROTECTED_PATTERNS: ReadonlyArray<RegExp> = [
  /^\/dashboard(\/|$)/,
];

/** Routes accessibles uniquement sans session (login/register) */
const AUTH_ONLY_PATTERNS: ReadonlyArray<RegExp> = [
  /^\/(login|register)(\/|$)/,
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PATTERNS.some((pattern) => pattern.test(pathname));
}

function isAuthOnlyRoute(pathname: string): boolean {
  return AUTH_ONLY_PATTERNS.some((pattern) => pattern.test(pathname));
}

/** Extrait l'adresse IP du client depuis les headers de la requête */
function getClientIp(request: NextRequest): string {
  // En production (Vercel, Cloudflare, etc.), l'IP est dans un header spécifique
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for peut contenir plusieurs IPs séparées par des virgules
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  // Fallback pour le développement local
  return "127.0.0.1";
}

/**
 * Crée une réponse 429 Too Many Requests avec le header Retry-After.
 */
function createRateLimitResponse(resetAt: number): NextResponse {
  const retryAfterSeconds = Math.ceil((resetAt - Date.now()) / 1000);

  return new NextResponse(
    JSON.stringify({
      error: "Trop de requêtes. Veuillez réessayer plus tard.",
      retryAfter: retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(1, retryAfterSeconds)),
      },
    }
  );
}

// =============================================================================
// Middleware principal
// =============================================================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = getClientIp(request);

  // Bypass rate limiting en développement/test
  const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

  let globalResult: RateLimitResult | undefined;

  if (!isDev) {
    // --- Vérification du rate limit pour les routes auth (plus restrictif) ---
    if (isAuthRoute(pathname)) {
      const authResult = authLimiter.check(`auth:${clientIp}`);
      if (!authResult.allowed) {
        return createRateLimitResponse(authResult.resetAt);
      }
    }

    // --- Vérification du rate limit global ---
    globalResult = globalLimiter.check(`global:${clientIp}`);
    if (!globalResult.allowed) {
      return createRateLimitResponse(globalResult.resetAt);
    }
  }

  // --- Rafraîchissement de session Supabase + protection des routes ---
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Mettre à jour les cookies sur la requête (pour le SSR en aval)
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          // Recréer la réponse avec les headers de requête mis à jour
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          // Mettre à jour les cookies sur la réponse (pour le navigateur)
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });

    // Rafraîchir la session (rotation des tokens)
    // En cas d'erreur réseau vers Supabase, on laisse passer (fail-open)
    // pour éviter une boucle de redirection login ↔ dashboard.
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // Supabase injoignable — on laisse passer sans bloquer
    }

    // Route protégée sans session → redirection login (désactivé en E2E)
    if (!user && isProtectedRoute(pathname) && !process.env.NEXT_PUBLIC_E2E_TEST) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      const redirectResponse = NextResponse.redirect(loginUrl);
      // Transférer les cookies rafraîchis sur la réponse de redirection
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }

    // Route auth-only avec session → redirection dashboard
    if (user && isAuthOnlyRoute(pathname)) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      const redirectResponse = NextResponse.redirect(dashboardUrl);
      // Transférer les cookies rafraîchis sur la réponse de redirection
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }
  }

  // Ajout des headers informatifs de rate limiting (RFC 6585 / draft-ietf-httpapi-ratelimit-headers)
  if (globalResult) {
    response.headers.set(
      "X-RateLimit-Limit",
      String(globalLimiter.getMaxRequests())
    );
    response.headers.set(
      "X-RateLimit-Remaining",
      String(globalResult.remaining)
    );
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.ceil(globalResult.resetAt / 1000))
    );
  }

  return response;
}

// =============================================================================
// Configuration du matcher — exclut les fichiers statiques
// =============================================================================

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
