# CLAUDE.md — Multitasks.fr

> **Ce fichier est lu automatiquement par Claude Code et tous les teammates.**
> Il sert de source de vérité unique pour le projet.

---

## Identité projet

```xml
<project>
  <name>Multitasks.fr</name>
  <tagline>To-do partout. Priorités nulle part. On tranche. Tu avances.</tagline>
  <type>SaaS B2C — Gestion de tâches avec priorisation IA</type>
  <repo>multitasks</repo>
</project>
```

---

## SECTION 0 — AGENT TEAMS : ORCHESTRATION MULTI-AGENTS

> **Prérequis** : `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` dans `settings.json`.
>
> Ce projet est conçu pour être construit par **7 agents spécialisés** coordonnés par un **Lead Orchestrator**.
> Chaque agent possède des fichiers dédiés, des tâches claires et des interfaces de communication.

### 0.1 — Architecture de l'équipe

```
┌───────────────────────────────────────────────────────────────┐
│                    🎯 LEAD ORCHESTRATOR                       │
│  Rôle : Coordination, séquençage, validation gates,          │
│         résolution de conflits, synthèse finale.              │
│  NE CODE JAMAIS — délègue uniquement.                        │
│  Mode : delegate (Shift+Tab)                                  │
└───────────┬───────────────────────────────────────────────────┘
            │
   ┌────────┼────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
   │        │        │          │          │          │          │          │
   ▼        ▼        ▼          ▼          ▼          ▼          ▼          ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│FOUND │ │FRONT │ │BACK  │ │  AI  │ │ PAY  │ │  QA  │ │MARKET│
│ATION │ │ END  │ │ END  │ │ENGINE│ │MENTS │ │AGENT │ │  ING │
│AGENT │ │AGENT │ │AGENT │ │AGENT │ │AGENT │ │      │ │AGENT │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### 0.2 — Définition des agents

```xml
<agent_team name="multitasks-build" description="Équipe de construction Multitasks.fr">

  <!-- ============================================ -->
  <!-- LEAD ORCHESTRATOR                            -->
  <!-- ============================================ -->
  <agent
    id="lead"
    name="team-lead"
    type="team-lead"
    model="opus"
    role="Chef d'orchestre — coordination pure, zéro code"
  >
    <responsibilities>
      - Séquencer les phases (1→6) et les blocs dans chaque phase
      - Spawner les agents au bon moment
      - Valider les gates inter-phases
      - Résoudre les conflits de fichiers ou de dépendances
      - Synthétiser les résultats et rapporter l'avancement
      - Approuver/rejeter les plans des agents (plan_mode_required)
    </responsibilities>
    <rules>
      - TOUJOURS utiliser delegate mode (Shift+Tab) pour ne pas coder directement
      - Ne JAMAIS modifier de fichier — déléguer à l'agent approprié
      - Vérifier les validation gates avant de lancer la phase suivante
      - Limiter les broadcasts aux annonces critiques
      - 5-6 tâches max par agent avant check-in
    </rules>
  </agent>

  <!-- ============================================ -->
  <!-- AGENT 1 : FOUNDATION                         -->
  <!-- ============================================ -->
  <agent
    id="foundation"
    name="foundation-agent"
    type="general-purpose"
    model="sonnet"
    role="Setup projet, config, structure, DB migrations"
    phase="1, 3.1, 5.3"
    plan_mode_required="true"
  >
    <spawn_prompt>
      Tu es l'agent Foundation de Multitasks.fr. Ta responsabilité : setup du projet,
      configuration, structure de fichiers, migrations Supabase, PWA config.
      Tu travailles UNIQUEMENT sur tes fichiers (voir FILE_OWNERSHIP dans CLAUDE.md section 0.2).
      Quand tu termines un bloc, envoie un message au team-lead avec le statut.
      Lis CLAUDE.md sections 3 (Architecture), 4 (Database), 7 (Sécurité), 10 (Dev Setup).
      RÈGLES : TypeScript strict, pas de any, pas de secrets hardcodés, commits conventionnels.
    </spawn_prompt>
    <file_ownership>
      next.config.ts
      tailwind.config.ts
      tsconfig.json
      package.json
      .env.example
      vitest.config.ts
      playwright.config.ts
      public/manifest.json
      public/sw.js
      public/icons/*
      supabase/migrations/*
      src/app/layout.tsx
      src/app/globals.css
      src/lib/db/local.ts
      src/lib/db/supabase-client.ts
      src/lib/db/supabase-server.ts
      src/lib/utils.ts
      src/lib/constants.ts
      src/types/*
      src/middleware.ts
    </file_ownership>
    <tasks>
      <task id="F-01" subject="Setup Next.js 15 + TS + Tailwind + shadcn/ui + Dexie.js + Zustand + Framer Motion"
            description="Initialiser le projet avec toutes les dépendances (inclure framer-motion, @upstash/ratelimit, isomorphic-dompurify). Structure de dossiers conforme à la section 3. .env.example, ESLint, Prettier. Security headers dans next.config.ts (section 7)."
            blocked_by="none"/>
      <task id="F-02" subject="Schéma Dexie.js (IndexedDB)"
            description="Implémenter src/lib/db/local.ts avec le schéma tasks + domains conforme section 2 (F01, F02). Versioning Dexie pour migrations futures."
            blocked_by="F-01"/>
      <task id="F-03" subject="Types TypeScript partagés"
            description="Créer src/types/task.ts, domain.ts, analysis.ts, user.ts, plan.ts conformes aux modèles section 2 et 4."
            blocked_by="F-01"/>
      <task id="F-04" subject="Migrations Supabase"
            description="6 fichiers SQL conformes section 4 (profiles, domains, tasks, analyses, subscriptions, RLS)."
            blocked_by="none"/>
      <task id="F-05" subject="Clients Supabase + middleware auth"
            description="supabase-client.ts (browser), supabase-server.ts (server), src/middleware.ts protection routes."
            blocked_by="F-04"/>
      <task id="F-06" subject="PWA config"
            description="manifest.json, service worker (sw.js), icons, next-pwa config. Install prompt mobile."
            blocked_by="F-01"/>
    </tasks>
  </agent>

  <!-- ============================================ -->
  <!-- AGENT 2 : FRONTEND                           -->
  <!-- ============================================ -->
  <agent
    id="frontend"
    name="frontend-agent"
    type="general-purpose"
    model="sonnet"
    role="UI/UX, composants React, stores Zustand, hooks"
    phase="1.3-1.5, 2.1-2.3, 3.4"
    plan_mode_required="false"
  >
    <spawn_prompt>
      Tu es l'agent Frontend de Multitasks.fr. Ta responsabilité : tous les composants React,
      les stores Zustand, les hooks custom, le layout responsive, le dark mode.
      Tu travailles UNIQUEMENT sur tes fichiers (voir FILE_OWNERSHIP dans CLAUDE.md section 0.2).

      EXIGENCE DESIGN PREMIUM (section 8 — LIS-LA INTÉGRALEMENT) :
      - Niveau visuel Linear/Notion/Vercel Dashboard. Chaque écran doit être beau et engageant.
      - Micro-interactions obligatoires : task_complete (confetti), drag_drop (spring), ai_loading (séquence).
      - Empty states soignés avec illustration SVG + CTA. Skeleton loading avec shimmer.
      - Conversion-driven : features Pro visibles mais lockées, upgrade nudge élégant.
      - Animations Framer Motion ou CSS transitions (pas de libs lourdes).
      - Dark mode PREMIUM (pas une simple inversion, voir palette dark dans section 8).

      Design system : shadcn/ui + TailwindCSS. Palette et screens dans section 8. Mobile-first.
      Quand tu termines un bloc, envoie un message au team-lead avec le statut.
      Lis CLAUDE.md sections 2 (Features), 8 (Design PREMIUM), 9 (Conventions).
      RÈGLES : Composants fonctionnels, props typées, pas de prop drilling >2 niveaux,
      lazy loading routes secondaires. Tester mobile AVANT desktop. Touch targets ≥44px.
    </spawn_prompt>
    <file_ownership>
      src/components/**/*
      src/stores/*
      src/hooks/*
      src/app/(dashboard)/**/*
      src/app/(auth)/**/*
    </file_ownership>
    <tasks>
      <task id="FE-01" subject="TaskCard + TaskForm + TaskList + TaskFilters"
            description="Composants tâches : carte, formulaire (create/edit), liste groupée par domaine. Filtre par statut. Drag and drop (react-beautiful-dnd)."
            blocked_by="F-02, F-03"/>
      <task id="FE-02" subject="Stores Zustand (tasks + domains + UI)"
            description="task-store.ts, domain-store.ts, ui-store.ts. CRUD via Dexie.js. Hooks useTasks, useDomains."
            blocked_by="F-02, F-03"/>
      <task id="FE-03" subject="DomainManager + DomainBadge + DomainSelector"
            description="CRUD domaines, sélecteur dans TaskForm, badge couleur+icône. 3 domaines par défaut. Limite 3 en gratuit."
            blocked_by="FE-02"/>
      <task id="FE-04" subject="Layout responsive (Sidebar + MobileNav + Header)"
            description="Sidebar fixe desktop, bottom nav mobile, header. Dark mode toggle. Navigation 4 routes. Breakpoints section 8."
            blocked_by="FE-01"/>
      <task id="FE-05" subject="CalendarWeek + CalendarMonth + ConflictBadge"
            description="Vues calendrier conformes F04. Détection conflits (2+ deadlines même jour ou charge >8h). Drag and drop. Toggle semaine/mois."
            blocked_by="FE-02"/>
      <task id="FE-06" subject="useCalendar hook"
            description="Logique calendrier : filtrage par date, charge par jour, détection conflits."
            blocked_by="FE-05"/>
      <task id="FE-07" subject="AnalysisLauncher + AnalysisResult + EisenhowerMatrix + QuotaIndicator"
            description="Sélection tâches (checkbox, max 20), bouton Analyser + quota, matrice Eisenhower visuelle, liste ordonnée, bouton Appliquer. Animation chargement &lt;10s."
            blocked_by="AI-02, FE-02"/>
      <task id="FE-08" subject="Pages Auth (login, register) + Settings"
            description="Login/register (email+password, magic link, Google OAuth). Settings : profil, domaines, abonnement, export, suppression."
            blocked_by="F-05"/>
    </tasks>
  </agent>

  <!-- ============================================ -->
  <!-- AGENT 3 : BACKEND                            -->
  <!-- ============================================ -->
  <agent
    id="backend"
    name="backend-agent"
    type="general-purpose"
    model="sonnet"
    role="API routes, sync engine, export, auth hooks"
    phase="3.1-3.2, 5.1-5.2"
    plan_mode_required="true"
  >
    <spawn_prompt>
      Tu es l'agent Backend de Multitasks.fr. Ta responsabilité : API routes Next.js,
      sync engine (local↔cloud), export PDF/CSV, logique côté serveur.
      Tu travailles UNIQUEMENT sur tes fichiers (voir FILE_OWNERSHIP dans CLAUDE.md section 0.2).

      SÉCURITÉ IRRÉPROCHABLE (section 7 — LIS-LA INTÉGRALEMENT) :
      - Zod sur 100% des endpoints. Pas d'exception. UUID validation sur tous les IDs.
      - Rate limiting : upstash/ratelimit ou Vercel KV. 100 req/min global, 20/min auth.
      - CORS restrictif (whitelist domaine prod + localhost dev). Pas de wildcard.
      - Security headers dans next.config.ts : CSP, HSTS, X-Frame-Options, Referrer-Policy.
      - Erreurs : JAMAIS de stack trace en prod. Message générique + log structuré serveur.
      - Logging : JSON structuré, JAMAIS de données personnelles (email, contenu tâches).
      - Service role key : UNIQUEMENT dans les API routes serveur. Grep de vérification.

      Quand tu termines un bloc, envoie un message au team-lead avec le statut.
      Lis CLAUDE.md sections 4 (Database), 6 (Pricing), 7 (Sécurité COMPLÈTE).
      RÈGLES : try/catch systématique, erreurs typées (AppError/AIError/SyncError),
      jamais de secrets en dur, RLS activé partout, DOMPurify sur contenu texte affiché.
    </spawn_prompt>
    <file_ownership>
      src/app/api/sync/**/*
      src/app/api/export/**/*
      src/lib/db/sync-engine.ts
      src/lib/auth/*
      src/lib/export/*
      src/lib/reminders/*
      src/lib/quotas/*
    </file_ownership>
    <tasks>
      <task id="BE-01" subject="Migration local → cloud"
            description="Logique pour migrer IndexedDB vers Supabase au premier login. Proposer, ne pas forcer. Dexie.js reste source primaire."
            blocked_by="F-04, F-05"/>
      <task id="BE-02" subject="Quota checker + reset"
            description="src/lib/quotas/checker.ts. Vérification serveur avant chaque analyse. Reset auto (lifetime/mensuel/quotidien selon plan)."
            blocked_by="F-04"/>
      <task id="BE-03" subject="Reminder scheduler"
            description="src/lib/reminders/scheduler.ts. Logique F05 : deadline - durée - 30min. Notification API + IndexedDB."
            blocked_by="F-02"/>
      <task id="BE-04" subject="Sync engine (push/pull)"
            description="sync-engine.ts + routes /api/sync/push et /pull. Incrémental via updated_at. Last-write-wins. Debounced 5s. Pro only."
            blocked_by="F-04, F-05, PAY-02"/>
      <task id="BE-05" subject="Export CSV + PDF"
            description="Routes /api/export/csv et /pdf. CSV : tâches + métadonnées. PDF : rapport analyse IA. Pro only."
            blocked_by="F-04, AI-02"/>
    </tasks>
  </agent>

  <!-- ============================================ -->
  <!-- AGENT 4 : AI ENGINE                          -->
  <!-- ============================================ -->
  <agent
    id="ai-engine"
    name="ai-engine-agent"
    type="general-purpose"
    model="opus"
    role="Intégration Anthropic, prompt engineering, parsing IA"
    phase="3.3"
    plan_mode_required="true"
  >
    <spawn_prompt>
      Tu es l'agent AI Engine de Multitasks.fr. Ta responsabilité : UNIQUE point d'intégration
      avec l'API Anthropic. Prompt d'analyse, parsing réponses, validation Zod.
      Tu travailles UNIQUEMENT sur tes fichiers (voir FILE_OWNERSHIP dans CLAUDE.md section 0.2).
      Modèle production : claude-sonnet-4-20250514. Temperature 0.1. Max tokens 2000.
      Le prompt complet est dans CLAUDE.md section 5 — implémente-le fidèlement.
      Quand tu termines, envoie un message au team-lead ET au frontend-agent (pour FE-07).

      SÉCURITÉ IA (section 7 — ai_security) :
      - Le prompt système est FIXE et NON modifiable par l'utilisateur.
      - Les titres/descriptions sont injectés dans un template, JAMAIS concaténés au prompt système.
      - Validation Zod EXHAUSTIVE de la réponse AVANT toute utilisation.
      - Si la réponse contient du HTML, des scripts ou du contenu inattendu → REJET.
      - Timeout 30s. Retry 1x seulement. Fallback gracieux (message utilisateur, pas de crash).
      - Logger tokens_used + duration_ms pour monitoring coûts et détection anomalies.
      - Tester avec des titres de tâches malveillants ("ignore previous instructions", injection HTML).

      RÈGLES : JSON strict en sortie, validation Zod avant stockage,
      ANTHROPIC_API_KEY côté serveur uniquement.
    </spawn_prompt>
    <file_ownership>
      src/app/api/ai/analyze/route.ts
      src/lib/ai/analyze.ts
      src/lib/ai/prompt-builder.ts
      src/lib/ai/response-parser.ts
      src/stores/analysis-store.ts
    </file_ownership>
    <tasks>
      <task id="AI-01" subject="Prompt builder"
            description="src/lib/ai/prompt-builder.ts conforme section 5. Injection dynamique tâches avec domaines, deadlines, durées. Timezone."
            blocked_by="F-03"/>
      <task id="AI-02" subject="API route /api/ai/analyze + response parser"
            description="Route POST : auth + quota check + Anthropic SDK + parsing Zod. Retry 1x. Sauvegarde DB. Conforme section 5."
            blocked_by="AI-01, BE-02, F-05"/>
      <task id="AI-03" subject="Analysis store (Zustand)"
            description="analysis-store.ts : état analyses (loading, results, history). Hook useAnalysis. Quota indicator."
            blocked_by="AI-02"/>
    </tasks>
  </agent>

  <!-- ============================================ -->
  <!-- AGENT 5 : PAYMENTS                           -->
  <!-- ============================================ -->
  <agent
    id="payments"
    name="payments-agent"
    type="general-purpose"
    model="sonnet"
    role="Stripe integration, plans, abonnements, webhooks"
    phase="4"
    plan_mode_required="true"
  >
    <spawn_prompt>
      Tu es l'agent Payments de Multitasks.fr. Ta responsabilité : intégration Stripe complète
      (checkout, webhooks, abonnements, packs, coupons étudiants).
      Tu travailles UNIQUEMENT sur tes fichiers (voir FILE_OWNERSHIP dans CLAUDE.md section 0.2).
      Plans dans CLAUDE.md section 6. 3 tiers : free, ia_quotidienne, pro_sync.
      Quand tu termines, envoie un message au team-lead ET au backend-agent (pour BE-04).
      RÈGLES : Stripe test mode d'abord, webhook signature verification,
      JAMAIS exposer STRIPE_SECRET_KEY côté client, graceful degradation.
    </spawn_prompt>
    <file_ownership>
      src/app/api/stripe/**/*
      src/lib/stripe/*
      src/components/pricing/*
    </file_ownership>
    <tasks>
      <task id="PAY-01" subject="Stripe setup + plans config"
            description="src/lib/stripe/client.ts et plans.ts. 3 plans section 6. Prix mensuels/annuels. Packs analyses."
            blocked_by="F-01"/>
      <task id="PAY-02" subject="Checkout + Webhook routes"
            description="/api/stripe/checkout POST + /api/stripe/webhook POST. Sync statut → profiles.plan. Signature verification."
            blocked_by="PAY-01, F-05"/>
      <task id="PAY-03" subject="PricingTable + PlanBadge + gestion abonnement"
            description="Composants pricing section 6. Toggle mensuel/annuel. Settings : upgrade/downgrade. Enforcement limites (message, pas blocage)."
            blocked_by="PAY-02, FE-04"/>
      <task id="PAY-04" subject="Offre étudiante + packs analyses"
            description="Coupon Stripe 50% étudiants. Vérification .edu ou justificatif. Packs one-time purchase."
            blocked_by="PAY-02"/>
    </tasks>
  </agent>

  <!-- ============================================ -->
  <!-- AGENT 6 : QA                                 -->
  <!-- ============================================ -->
  <agent
    id="qa"
    name="qa-agent"
    type="general-purpose"
    model="sonnet"
    role="Tests unitaires, E2E, audit sécurité, responsive"
    phase="Transversal — après chaque phase"
    plan_mode_required="false"
  >
    <spawn_prompt>
      Tu es l'agent QA de Multitasks.fr. Ta responsabilité : tests (Vitest + Playwright),
      AUDIT SÉCURITÉ COMPLET, validation responsive, accessibilité et DESIGN QUALITY.
      Tu travailles UNIQUEMENT dans tests/**/*.

      SÉCURITÉ (section 7 — security_audit_checklist) :
      - Tester isolation RLS : 2 users test, vérifier aucun accès cross-user.
      - Grep SUPABASE_SERVICE_ROLE_KEY dans src/ : absent de tout fichier client.
      - Tester rate limiting : burst 200 req → vérifier 429.
      - Vérifier headers sécurité (CSP, HSTS, X-Frame-Options).
      - npm audit : 0 vulnérabilité high/critical.
      - Stripe webhook avec signature invalide → doit rejeter.
      - Prompt injection dans titre tâche → analyse doit rester valide.

      DESIGN QUALITY :
      - Micro-interactions présentes (task complete, AI loading, drag drop).
      - Empty states soignés (pas d'écran vide). Skeleton loaders. Dark mode premium.

      Tu es spawné à la fin de chaque phase pour valider la gate (section 11 de CLAUDE.md).
      Quand tu trouves un bug → message à l'agent propriétaire du fichier.
      Quand la gate passe → message au team-lead "✅ Gate Phase N validée".
      RÈGLES : Coverage 80%+ sur lib/, E2E pour chaque user story critique,
      responsive (320px/768px/1280px), contraste WCAG AA, navigation clavier,
      aria labels, touch targets ≥44px, pas de console.log.
    </spawn_prompt>
    <file_ownership>
      tests/**/*
    </file_ownership>
    <tasks>
      <task id="QA-01" subject="Tests unitaires Phase 1"
            description="Vitest : CRUD tasks Dexie.js, CRUD domains, stores Zustand. Coverage 80%+ sur src/lib/db/local.ts et src/stores/."
            blocked_by="FE-02, FE-03"/>
      <task id="QA-02" subject="Tests unitaires Phase 2"
            description="Vitest : reminder scheduler, conflict detection, calendar hooks."
            blocked_by="FE-06, BE-03"/>
      <task id="QA-03" subject="Tests unitaires Phase 3"
            description="Vitest : prompt-builder, response-parser, quota checker. Mock Anthropic API."
            blocked_by="AI-02, BE-02"/>
      <task id="QA-04" subject="Tests E2E parcours critiques"
            description="Playwright : onboarding (3 tâches en 5min), analyse IA flow, payment flow, sync."
            blocked_by="PAY-02, AI-02"/>
      <task id="QA-05" subject="Audit sécurité"
            description="RLS toutes tables, pas de secrets exposés, Zod tous endpoints, rate limiting, CORS, XSS."
            blocked_by="BE-04, PAY-02"/>
      <task id="QA-06" subject="Validation responsive + accessibilité"
            description="320px/768px/1280px. Contraste WCAG AA, navigation clavier, aria labels."
            blocked_by="FE-04, FE-07"/>
    </tasks>
  </agent>

  <!-- ============================================ -->
  <!-- AGENT 7 : MARKETING                          -->
  <!-- ============================================ -->
  <agent
    id="marketing"
    name="marketing-agent"
    type="general-purpose"
    model="sonnet"
    role="Landing page, SEO, copywriting, analytics"
    phase="6"
    plan_mode_required="false"
  >
    <spawn_prompt>
      Tu es l'agent Marketing de Multitasks.fr. Ta responsabilité : landing page HAUTE CONVERSION,
      SEO technique, copywriting percutant, analytics minimal.
      Tu travailles UNIQUEMENT sur tes fichiers (voir FILE_OWNERSHIP dans CLAUDE.md section 0.2).

      EXIGENCE DESIGN PREMIUM (section 8 — landing_page) :
      - La landing page doit être au niveau des meilleures SaaS (Linear, Vercel, Cal.com).
      - Hero impactant : Cal Sans 5xl, gradient mesh bg, screenshot app en perspective 3D.
      - Animations au scroll (IntersectionObserver) : fade-in + slide-up staggered.
      - Pricing table avec plan Pro visuellement dominant (scale, gradient border, badge).
      - Final CTA : fond dark gradient, contraste maximal, urgence douce.
      - Conversion tactics section 8 : social proof, feature teasing, pricing psychology.

      Copie marketing dans section 1. Ton : direct, concret, zéro blabla, tutoiement.
      Quand tu termines, envoie un message au team-lead.
      RÈGLES : Lighthouse > 90 (TOUTES catégories), Core Web Vitals verts,
      structured data SoftwareApplication, OG tags (image 1200x630), pas de cookies tiers.
      Images : WebP/AVIF, lazy loading, srcset responsive. Fonts : preload + display swap.
    </spawn_prompt>
    <file_ownership>
      src/app/page.tsx
      src/app/sitemap.ts
      src/app/robots.ts
      src/app/opengraph-image.tsx
    </file_ownership>
    <tasks>
      <task id="MKT-01" subject="Landing page complète"
            description="Hero + 3 preuves + démo visuelle + PricingTable (réutiliser PAY-03) + FAQ + footer. Copie section 1."
            blocked_by="PAY-03, FE-04"/>
      <task id="MKT-02" subject="SEO technique"
            description="sitemap.ts, robots.ts, metadata, OG tags, structured data JSON-LD SoftwareApplication."
            blocked_by="MKT-01"/>
      <task id="MKT-03" subject="Analytics minimal"
            description="Vercel Analytics. Événements : inscription, analyse, upgrade. Pas de cookies tiers."
            blocked_by="MKT-01"/>
    </tasks>
  </agent>

</agent_team>
```

### 0.3 — Séquençage des phases

```xml
<phase_sequencing>

  <phase id="1" name="Fondations — MVP Local" agents="foundation + frontend">
    <sequence>
      1. Lead spawne foundation-agent → F-01, F-02, F-03
      2. Quand F-01 terminé → Lead spawne frontend-agent → FE-01, FE-02 (dépendent F-02, F-03)
      3. Frontend enchaîne FE-03 (domaines), FE-04 (layout)
      4. Lead spawne qa-agent → QA-01
      5. Validation gate Phase 1
    </sequence>
    <parallelism>foundation (F-02, F-03) || frontend (FE-01, FE-02) dès F-01 terminé</parallelism>
  </phase>

  <phase id="2" name="Calendrier et Rappels" agents="frontend + backend">
    <sequence>
      1. frontend-agent → FE-05 (calendrier), FE-06 (hook)
      2. backend-agent → BE-03 (rappels) — EN PARALLÈLE de FE-05
      3. qa-agent → QA-02
      4. Validation gate Phase 2
    </sequence>
  </phase>

  <phase id="3" name="Auth + IA" agents="foundation + backend + ai-engine + frontend">
    <sequence>
      1. foundation-agent → F-04 (migrations), F-05 (clients Supabase)
      2. EN PARALLÈLE : ai-engine-agent → AI-01 (prompt, dépend F-03 seulement)
      3. Quand F-04+F-05 → backend-agent → BE-01, BE-02
      4. Quand AI-01+BE-02+F-05 → ai-engine-agent → AI-02, AI-03
      5. Quand AI-02 → frontend-agent → FE-07 (UI analyse), FE-08 (auth UI)
      6. qa-agent → QA-03
      7. Validation gate Phase 3
    </sequence>
    <parallelism>foundation (F-04) || ai-engine (AI-01) — fichiers disjoints</parallelism>
  </phase>

  <phase id="4" name="Paiements Stripe" agents="payments">
    <sequence>
      1. payments-agent → PAY-01 → PAY-02 → PAY-03 || PAY-04
      2. qa-agent → QA-04 (E2E), QA-05 (audit sécurité)
      3. Validation gate Phase 4
    </sequence>
  </phase>

  <phase id="5" name="Sync + Export + PWA" agents="backend + foundation">
    <sequence>
      1. backend-agent → BE-04 (sync, dépend PAY-02), BE-05 (export)
      2. EN PARALLÈLE : foundation-agent → F-06 (PWA)
      3. qa-agent → QA-06 (responsive + a11y)
      4. Validation gate Phase 5
    </sequence>
  </phase>

  <phase id="6" name="Landing + Lancement" agents="marketing + qa">
    <sequence>
      1. marketing-agent → MKT-01, MKT-02, MKT-03
      2. EN PARALLÈLE : qa-agent → tests E2E bout en bout
      3. Validation gate finale
    </sequence>
  </phase>

</phase_sequencing>
```

### 0.4 — Protocoles de communication

```xml
<communication_protocols>

  <protocol name="task_completion">
    1. Marquer tâche "completed" dans la task list
    2. Message au team-lead : "✅ [TASK_ID] terminé. Résumé : [1-2 lignes]"
    3. Si un agent est bloqué par cette tâche → lui envoyer aussi un message
  </protocol>

  <protocol name="bug_found">
    1. Identifier l'agent propriétaire du fichier (FILE_OWNERSHIP)
    2. Message à cet agent : "🐛 Bug dans [fichier] : [description]. Test : [nom_test]"
    3. Message au team-lead : "🐛 Bug trouvé, assigné à [agent]"
  </protocol>

  <protocol name="blocker">
    1. Message au team-lead : "🚫 BLOQUÉ sur [TASK_ID]. Raison : [détail]. Besoin : [x]"
    2. Ne PAS attendre — travailler sur d'autres tâches non bloquées
  </protocol>

  <protocol name="validation_gate">
    1. Lead demande au qa-agent de valider
    2. QA exécute tests + checklist (section 11)
    3. OK → "✅ Gate Phase N validée" | KO → "❌ Gate Phase N : [problèmes]"
    4. Lead assigne corrections, puis relance la gate
  </protocol>

  <protocol name="file_conflict_prevention">
    RÈGLE ABSOLUE : Chaque agent ne modifie QUE ses FILE_OWNERSHIP.
    Besoin d'un fichier hors zone → message au team-lead → lead demande au propriétaire.
  </protocol>

</communication_protocols>
```

### 0.5 — Quick Start pour le Lead

```xml
<lead_quickstart>

  <!-- LANCEMENT Phase 1 -->
  <step n="1">Teammate({ operation: "spawnTeam", team_name: "multitasks-build" })</step>
  <step n="2">Créer tâches F-01 à F-03 + FE-01 à FE-04 + QA-01 dans la task list</step>
  <step n="3">
    Task({ team_name: "multitasks-build", name: "foundation-agent",
           subagent_type: "general-purpose", prompt: "[spawn_prompt foundation]",
           run_in_background: true })
  </step>
  <step n="4">Attendre F-01 terminé</step>
  <step n="5">
    Task({ team_name: "multitasks-build", name: "frontend-agent",
           subagent_type: "general-purpose", prompt: "[spawn_prompt frontend]",
           run_in_background: true })
  </step>
  <step n="6">Attendre toutes tâches Phase 1 terminées</step>
  <step n="7">
    Task({ team_name: "multitasks-build", name: "qa-agent",
           subagent_type: "general-purpose", prompt: "[spawn_prompt qa]",
           run_in_background: true })
  </step>
  <step n="8">QA valide gate Phase 1 → passer à Phase 2</step>

  <!-- TRANSITION vers phase suivante -->
  <transition>
    1. Vérifier gate passée (QA)
    2. requestShutdown agents non nécessaires
    3. Créer tâches de la phase suivante
    4. Spawner/réassigner agents nécessaires
    5. broadcast("Phase N démarrée. Objectif : [goal]")
  </transition>

</lead_quickstart>
```

---

## SECTION 1 — VISION PRODUIT

```xml
<product_vision>
  <problem>
    Les utilisateurs ont des tâches éparpillées entre outils, sans hiérarchisation claire.
    Ils perdent du temps à décider quoi faire plutôt qu'à le faire.
    Les deadlines se chevauchent sans visibilité. Les rappels sont soit absents, soit excessifs.
  </problem>
  <solution>
    App de gestion de tâches par domaines de responsabilité + IA qui priorise via
    la matrice d'Eisenhower. Calendrier visuel + détection de conflits + rappels intelligents.
  </solution>
  <value_proposition>1 analyse = 20 tâches priorisées en 10 secondes.</value_proposition>
  <target_users>
    Primary : Professionnels indépendants et cadres multi-domaines.
    Secondary : Étudiants, chefs de projet, consultants.
    Persona : Marie, 35 ans, freelance, 60+ tâches, perd 30min/jour à trier.
  </target_users>
  <success_criteria>
    onboarding_completion=70% | analysis_usage=50% | conversion=5% | retention=60% | time_saved=1h/sem
  </success_criteria>
</product_vision>
```

---

## SECTION 2 — FONCTIONNALITÉS

```xml
<features>
  <feature id="F01" name="Gestion de tâches" priority="P0" tier="all">
    CRUD complet. Champs : id, title(200), description(2000), domain_id, status(todo/in_progress/done/cancelled),
    deadline, estimated_duration(min), priority(haute/moyenne/basse/non_definie),
    eisenhower_quadrant, next_action(300), ai_analysis_id, reminder_at, reminder_sent,
    recurrence_rule(jsonb), sort_order, created_at, updated_at, completed_at.
  </feature>
  <feature id="F02" name="Domaines" priority="P0" tier="all">
    id, name(50), color(hex), icon(Lucide), sort_order, is_archived.
    Limites : free=3, autres=unlimited. Défauts : Pro(#3B82F6), Perso(#10B981), Urgent(#EF4444).
  </feature>
  <feature id="F03" name="Analyse IA" priority="P0" tier="all">
    20 tâches max par analyse. Matrice Eisenhower. Priorité + durée estimée + next action.
    Quotas : free=2 lifetime | ia_quotidienne=8/mois | pro_sync=3/jour.
    Config : claude-sonnet-4-20250514, temp 0.1, max_tokens 2000.
  </feature>
  <feature id="F04" name="Calendrier" priority="P1" tier="all">
    Semaine(all) + Mois(payant). Conflict detection (2+ deadlines/jour ou charge>8h). Drag and drop.
  </feature>
  <feature id="F05" name="Rappels" priority="P1" tier="all">
    deadline+durée→rappel=deadline-durée-30min | deadline seule→-24h | sinon→manuel.
    Limites : free=1/jour | ia_quotidienne=5/jour | pro=unlimited.
  </feature>
  <feature id="F06" name="Sync cloud" priority="P2" tier="pro_sync">
    Local-first IndexedDB + sync Supabase. Last-write-wins. Incrémental via updated_at.
  </feature>
  <feature id="F07" name="Export" priority="P2" tier="pro_sync">CSV + PDF.</feature>
</features>
```

---

## SECTION 3 — ARCHITECTURE

```xml
<architecture>
  <pattern>Local-first SaaS with AI Hub</pattern>
  <stack>
    Frontend: Next.js 15, React 19, TailwindCSS 4, shadcn/ui, Lucide, Dexie.js, date-fns, react-beautiful-dnd, Zustand, next-pwa, Framer Motion (micro-interactions premium)
    Backend: Next.js API Routes, Supabase (Auth + Postgres + RLS), @upstash/ratelimit (rate limiting), DOMPurify (XSS sanitization)
    IA: Anthropic SDK TS, Claude Sonnet 4, Zod
    Paiements: Stripe (abonnements + webhooks)
    Infra: Vercel, Supabase Cloud
    Qualité: TypeScript strict, Vitest, Playwright, ESLint + Prettier
  </stack>
  <folder_structure>
    multitasks/
    ├── src/app/(auth)/ (dashboard)/ api/ai/ api/sync/ api/stripe/ api/export/
    ├── src/components/ui/ tasks/ domains/ calendar/ analysis/ layout/ pricing/
    ├── src/lib/db/ ai/ stripe/ auth/ export/ reminders/ quotas/
    ├── src/stores/ hooks/ types/
    ├── supabase/migrations/
    ├── public/ tests/ .env.example CLAUDE.md
  </folder_structure>
</architecture>
```

---

## SECTION 4 — BASE DE DONNÉES

```xml
<database>
  <table name="profiles">
    id(uuid pk fk auth.users), display_name, plan(free|ia_quotidienne|pro_sync),
    stripe_customer_id, stripe_subscription_id, analyses_used_total(int 0),
    analyses_used_period(int 0), period_reset_at, created_at, updated_at.
    RLS: auth.uid() = id
  </table>
  <table name="domains">
    id(uuid pk), user_id(fk profiles cascade), name(50), color, icon,
    sort_order(0), is_archived(false), created_at, updated_at.
    RLS: auth.uid() = user_id
  </table>
  <table name="tasks">
    id(uuid pk), user_id(fk profiles cascade), domain_id(fk domains set null),
    title(200), description(2000), status(todo), deadline, estimated_duration,
    priority(non_definie), eisenhower_quadrant, next_action(300),
    ai_analysis_id(fk analyses), reminder_at, reminder_sent(false),
    recurrence_rule(jsonb), sort_order(0), completed_at, created_at, updated_at.
    RLS: auth.uid() = user_id
    Index: (user_id,status), (user_id,deadline), (user_id,domain_id)
  </table>
  <table name="analyses">
    id(uuid pk), user_id(fk profiles cascade), task_ids(uuid[]),
    results(jsonb), summary, tokens_used, model_used, duration_ms, created_at.
    RLS: auth.uid() = user_id
  </table>
</database>
```

---

## SECTION 5 — LOGIQUE IA

```xml
<ai_analysis endpoint="/api/ai/analyze" method="POST" auth="required">
  <system_prompt>
    Expert productivité. Matrice Eisenhower. Durée arrondie 5min (5-480). Next action = verbe+objet+contexte.
    URGENT = deadline &lt;48h. IMPORTANT = impact significatif. risk_flag si deadline &lt;48h ou 2+ même jour.
    Ordre : urgent+important → important(quick wins) → urgent non important → reste.
    FORMAT : JSON strict. { tasks: [{task_id, eisenhower_quadrant, suggested_priority,
    estimated_duration_minutes, next_action, reasoning, risk_flag, suggested_order}],
    summary, conflict_warnings }
  </system_prompt>
  <validation>Zod. task_id valides, quadrant valide, durée 5-480, order unique. Retry 1x → fallback.</validation>
</ai_analysis>
```

---

## SECTION 6 — PRICING

```xml
<pricing>
  <plan id="free">0€. 3 domaines, 60 tâches, 2 analyses lifetime, 1 rappel/jour, semaine, local.</plan>
  <plan id="ia_quotidienne">5.90€/mois ou 49€/an. Illimité, 8 analyses/mois, 5 rappels/jour, complet, local.</plan>
  <plan id="pro_sync" recommended="true">12.90€/mois ou 99€/an. Tout illimité, 3 analyses/jour, sync, export, support.
    Packs : 10 analyses=4.90€, 30=9.90€. Étudiant : 49€/an.</plan>
  <guarantees>30j remboursé. "1h gagnée" Pro. Annulation 2 clics.</guarantees>
</pricing>
```

---

## SECTION 7 — SÉCURITÉ (NIVEAU PRODUCTION COMMERCIALE)

> **EXIGENCE ABSOLUE** : La sécurité de MultiTasks doit être irréprochable.
> L'application traite des données personnelles et professionnelles sensibles.
> Un incident de sécurité = mort du produit. Zéro compromis.

```xml
<security>

  <!-- ============================================ -->
  <!-- AUTHENTIFICATION                             -->
  <!-- ============================================ -->
  <authentication>
    <provider>Supabase Auth (GoTrue)</provider>
    <methods>
      email_password : validation email, password min 8 chars + 1 majuscule + 1 chiffre + 1 spécial.
      magic_link : expiration 10 min, single-use, rate limited 3/heure par email.
      google_oauth : scope minimal (email, profile). PKCE flow obligatoire.
    </methods>
    <session>
      JWT via Supabase. Access token : expiration 1h. Refresh token : expiration 7j.
      Rotation automatique des refresh tokens (chaque utilisation génère un nouveau).
      Stockage : httpOnly cookies côté serveur, JAMAIS localStorage.
    </session>
    <brute_force_protection>
      5 tentatives échouées → lock 15 min par email.
      10 tentatives → lock 1h + notification email à l'utilisateur.
      Rate limit global : 20 auth requests/min par IP.
    </brute_force_protection>
    <password_reset>
      Token single-use, expiration 1h.
      Notification email à l'ancienne adresse si changement d'email.
      Invalidation de toutes les sessions existantes après changement de mot de passe.
    </password_reset>
  </authentication>

  <!-- ============================================ -->
  <!-- ISOLATION DES DONNÉES                        -->
  <!-- ============================================ -->
  <data_isolation>
    <rls>
      Row Level Security activé sur TOUTES les tables sans exception.
      Politique : auth.uid() = user_id (ou id pour profiles).
      VÉRIFICATION : aucune query ne doit fonctionner sans JWT valide.
      Test obligatoire : tenter d'accéder aux données d'un autre utilisateur → 0 résultat.
      Pas de SECURITY DEFINER sauf migrations ponctuelles (puis révoquer).
    </rls>
    <service_role_key>
      SUPABASE_SERVICE_ROLE_KEY : UNIQUEMENT côté serveur (API routes).
      JAMAIS dans un fichier qui commence par NEXT_PUBLIC_.
      JAMAIS accessible côté client même via process.env (vérifier le bundling).
      Utilisation : webhooks Stripe, tâches admin, migrations.
    </service_role_key>
  </data_isolation>

  <!-- ============================================ -->
  <!-- CHIFFREMENT                                  -->
  <!-- ============================================ -->
  <encryption>
    At rest : Supabase (AES-256 transparent). Pas de données sensibles en clair dans les logs.
    In transit : TLS 1.3 obligatoire partout. HSTS header avec max-age=31536000 includeSubDomains.
    Local (IndexedDB) : Non chiffré (device trust model). Mention dans les CGU.
    API keys : Jamais transmises au client. Appels Anthropic/Stripe côté serveur uniquement.
  </encryption>

  <!-- ============================================ -->
  <!-- VALIDATION DES ENTRÉES                       -->
  <!-- ============================================ -->
  <input_validation>
    <rule>Zod sur 100% des endpoints API. Pas d'exception.</rule>
    <rule>Sanitization XSS : DOMPurify ou équivalent sur TOUT contenu texte affiché.
          Les titres et descriptions de tâches sont du texte pur — JAMAIS interprétés comme HTML.</rule>
    <rule>SQL Injection : impossible via Supabase client (parameterized queries).
          Vérifier qu'aucune query brute n'est construite par concaténation.</rule>
    <rule>File upload : AUCUN file upload dans le MVP. Si ajouté plus tard :
          validation MIME type serveur, taille max 5MB, scan antivirus, stockage Supabase Storage (pas filesystem).</rule>
    <rule>Longueurs max strictes : title=200, description=2000, domain_name=50, next_action=300.
          Rejet immédiat si dépassement (pas de troncature silencieuse).</rule>
    <rule>UUID validation : tous les IDs passés en paramètre doivent être des UUID v4 valides.</rule>
  </input_validation>

  <!-- ============================================ -->
  <!-- RATE LIMITING                                -->
  <!-- ============================================ -->
  <rate_limiting>
    Global API : 100 requêtes/min par IP (Vercel Edge Middleware).
    Auth endpoints : 20 requêtes/min par IP.
    AI analysis : géré par le système de quotas (pas de rate limit HTTP supplémentaire).
    Stripe webhooks : pas de rate limit (proviennent de Stripe, vérifiés par signature).
    Implémentation : Vercel KV (Redis) ou upstash/ratelimit.
    Réponse si limité : 429 Too Many Requests + header Retry-After.
  </rate_limiting>

  <!-- ============================================ -->
  <!-- HEADERS DE SÉCURITÉ                          -->
  <!-- ============================================ -->
  <security_headers>
    Configurés dans next.config.ts headers() :
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com;
      style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co
      https://api.anthropic.com https://api.stripe.com; frame-src https://js.stripe.com;
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    X-XSS-Protection: 0 (désactivé au profit de CSP)
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  </security_headers>

  <!-- ============================================ -->
  <!-- CORS                                         -->
  <!-- ============================================ -->
  <cors>
    Origines autorisées : uniquement le domaine de production (multitasks.fr) + localhost:3000 en dev.
    Methods : GET, POST, PUT, DELETE, OPTIONS.
    Headers : Content-Type, Authorization.
    Credentials : true (pour les cookies httpOnly).
    Pas de wildcard (*) en production. JAMAIS.
  </cors>

  <!-- ============================================ -->
  <!-- STRIPE SÉCURITÉ                              -->
  <!-- ============================================ -->
  <stripe_security>
    Webhook : TOUJOURS vérifier la signature avec STRIPE_WEBHOOK_SECRET via stripe.webhooks.constructEvent().
    Checkout : Créer la session côté serveur. Le client reçoit UNIQUEMENT l'URL de redirection.
    Clé publishable (NEXT_PUBLIC_STRIPE_KEY) : seule clé côté client, ne permet que l'affichage Elements.
    Idempotency keys : sur toutes les opérations de création (checkout, subscription update).
    Pas de stockage de données de carte — tout géré par Stripe.
  </stripe_security>

  <!-- ============================================ -->
  <!-- ANTHROPIC API SÉCURITÉ                       -->
  <!-- ============================================ -->
  <ai_security>
    ANTHROPIC_API_KEY : côté serveur uniquement. Route /api/ai/analyze = seul point d'appel.
    Prompt injection protection :
      - Les titres/descriptions des tâches sont injectés dans un template fixe.
      - Le prompt système est NON modifiable par l'utilisateur.
      - La réponse est validée par Zod AVANT toute utilisation.
      - Si la réponse contient du contenu inattendu (HTML, scripts) → rejet.
    Tokens : logger tokens_used par analyse pour monitoring des coûts et détection d'anomalies.
    Timeout : 30s max par appel. Si dépassé → erreur gracieuse, pas de retry infini.
  </ai_security>

  <!-- ============================================ -->
  <!-- RGPD / CONFORMITÉ                            -->
  <!-- ============================================ -->
  <rgpd>
    <consent>Consentement explicite à l'inscription. Case à cocher non pré-cochée. CGU + Politique de confidentialité.</consent>
    <data_minimization>
      Collecter UNIQUEMENT : email, display_name, données de tâches.
      Pas de tracking analytics invasif. Pas de cookies tiers. Pas de fingerprinting.
      Vercel Analytics = privacy-friendly, pas de cookies, pas de données personnelles.
    </data_minimization>
    <data_access>Export CSV via /api/export/csv (toutes les données de l'utilisateur).</data_access>
    <data_deletion>
      Suppression compte = CASCADE DELETE toutes les données (tasks, domains, analyses, profile).
      Confirmation en 2 étapes : 1) saisir "SUPPRIMER" 2) confirmation email.
      Données supprimées sous 24h (soft delete immédiat, hard delete par cron).
      Stripe : annulation abonnement + suppression customer si demandé.
    </data_deletion>
    <data_portability>Export CSV + PDF disponible pour tous les plans payants.</data_portability>
    <ai_disclosure>
      Banner visible à la première analyse IA :
      "L'analyse envoie les titres et descriptions de vos tâches à l'API Anthropic (Claude).
       Vos données ne sont ni stockées ni utilisées pour l'entraînement des modèles."
      Lien vers la politique de données Anthropic.
    </ai_disclosure>
    <cookies>
      Cookies strictement nécessaires uniquement (session auth).
      Pas de banner cookies (car pas de cookies analytics/marketing).
    </cookies>
  </rgpd>

  <!-- ============================================ -->
  <!-- SECRETS ET ENVIRONNEMENT                     -->
  <!-- ============================================ -->
  <secrets>
    ANTHROPIC_API_KEY         → Vercel env (encrypted, server only)
    SUPABASE_SERVICE_ROLE_KEY → Vercel env (encrypted, server only, CRITIQUE)
    STRIPE_SECRET_KEY         → Vercel env (encrypted, server only)
    STRIPE_WEBHOOK_SECRET     → Vercel env (encrypted, server only)
    NEXT_PUBLIC_SUPABASE_URL  → Vercel env (public, safe)
    NEXT_PUBLIC_SUPABASE_ANON_KEY → Vercel env (public, protégé par RLS)
    NEXT_PUBLIC_STRIPE_KEY    → Vercel env (publishable, client-safe)
    NEXT_PUBLIC_APP_URL       → Vercel env (public)

    VÉRIFICATION BUILD : grep -r "SUPABASE_SERVICE_ROLE_KEY" src/ → doit retourner
    UNIQUEMENT des fichiers dans src/app/api/ ou src/lib/ côté serveur.
    Si trouvé dans un composant React → ERREUR CRITIQUE, corriger immédiatement.
  </secrets>

  <!-- ============================================ -->
  <!-- LOGGING ET MONITORING                        -->
  <!-- ============================================ -->
  <logging>
    RÈGLE : JAMAIS de données personnelles dans les logs (pas d'email, pas de contenu de tâches).
    Logs structurés JSON : { timestamp, level, action, user_id_hash, duration_ms, status_code }.
    Erreurs : stack trace en dev, message générique en prod (pas de leak d'infos internes).
    Monitoring : Vercel Analytics + Vercel Logs. Alerte si taux d'erreur > 1%.
    AI monitoring : tokens_used par analyse, coût estimé, détection de spike.
  </logging>

  <!-- ============================================ -->
  <!-- AUDIT DE SÉCURITÉ (TÂCHES QA)                -->
  <!-- ============================================ -->
  <security_audit_checklist>
    [ ] RLS activé et testé sur toutes les tables (tenter accès cross-user)
    [ ] SUPABASE_SERVICE_ROLE_KEY jamais côté client (grep vérifié)
    [ ] Tous les endpoints ont Zod validation
    [ ] CSP headers configurés et testés
    [ ] HSTS activé
    [ ] CORS restrictif (pas de wildcard)
    [ ] Stripe webhook signature vérifiée
    [ ] Rate limiting fonctionnel (tester avec burst)
    [ ] Pas de console.log avec données sensibles
    [ ] Password policy respectée (8+ chars, complexité)
    [ ] Refresh token rotation active
    [ ] XSS : aucun contenu utilisateur rendu comme HTML
    [ ] Prompt injection : réponse IA validée par Zod, pas de code exécuté
    [ ] Export données : accessible uniquement à l'utilisateur propriétaire
    [ ] Suppression compte : cascade complète vérifiée
    [ ] Lighthouse security audit : 0 vulnérabilité
    [ ] npm audit : 0 vulnérabilité high/critical
  </security_audit_checklist>

</security>
```

---

## SECTION 8 — DESIGN (PREMIUM — NIVEAU COMMERCIAL)

> **EXIGENCE ABSOLUE** : L'esthétique de MultiTasks doit être au niveau des meilleures apps SaaS du marché
> (Linear, Notion, Vercel Dashboard, Arc Browser). Chaque écran doit donner envie de rester.
> Chaque interaction doit être satisfaisante. Le design VEND autant que la fonctionnalité.

```xml
<design>

  <!-- ============================================ -->
  <!-- PHILOSOPHIE DESIGN                           -->
  <!-- ============================================ -->
  <philosophy>
    - PREMIUM MINIMAL : Chaque pixel justifié. Espaces généreux. Pas de surcharge visuelle.
    - MICRO-INTERACTIONS : Chaque action utilisateur reçoit un feedback visuel immédiat et satisfaisant.
    - PROGRESSIVE DISCLOSURE : Montrer l'essentiel, révéler la profondeur au bon moment.
    - EMOTIONAL DESIGN : L'app doit provoquer un sentiment de contrôle et de sérénité, pas de stress.
    - CONVERSION-DRIVEN : Chaque écran guide subtilement vers l'action suivante et ultimement vers le CTA payant.
  </philosophy>

  <!-- ============================================ -->
  <!-- PRINCIPES UX                                 -->
  <!-- ============================================ -->
  <principles>
    <principle>Mobile-first — 70% mobile. Touch targets ≥44px. Safe area iOS/Android.</principle>
    <principle>Analyse IA &lt; 10s avec animation de chargement engageante (pas un simple spinner).</principle>
    <principle>Zéro friction onboarding — utilisation immédiate, valeur perçue en &lt;30 secondes.</principle>
    <principle>Affordance pouce — actions principales accessibles en zone de confort (bas de l'écran mobile).</principle>
    <principle>Delightful defaults — l'app est belle dès le premier lancement, avant même que l'utilisateur ajoute du contenu.</principle>
  </principles>

  <!-- ============================================ -->
  <!-- PALETTE COULEURS (avec sémantique)           -->
  <!-- ============================================ -->
  <color_palette>
    <!-- Primaires -->
    <color name="primary-50" hex="#EFF6FF"/>
    <color name="primary-100" hex="#DBEAFE"/>
    <color name="primary-500" hex="#2563EB" usage="CTA principaux, liens, sélection active"/>
    <color name="primary-600" hex="#1D4ED8" usage="CTA hover"/>
    <color name="primary-700" hex="#1E40AF" usage="CTA pressed"/>
    <!-- Accent IA -->
    <color name="ai-400" hex="#A78BFA"/>
    <color name="ai-500" hex="#7C3AED" usage="Tout ce qui touche à l'IA : bouton Analyser, badges premium, glow effects"/>
    <color name="ai-600" hex="#6D28D9" usage="AI hover"/>
    <!-- Sémantiques -->
    <color name="success" hex="#10B981" usage="Tâches complétées, confirmations. Animation check satisfaisante."/>
    <color name="warning" hex="#F59E0B" usage="Rappels, conflits modérés"/>
    <color name="danger" hex="#EF4444" usage="Deadlines critiques, erreurs, suppression"/>
    <!-- Neutres -->
    <color name="neutral-50" hex="#F8FAFC" usage="Background principal (light)"/>
    <color name="neutral-100" hex="#F1F5F9" usage="Background secondaire, hover states"/>
    <color name="neutral-200" hex="#E2E8F0" usage="Bordures, séparateurs"/>
    <color name="neutral-400" hex="#94A3B8" usage="Texte placeholder, icônes inactives"/>
    <color name="neutral-600" hex="#475569" usage="Texte secondaire"/>
    <color name="neutral-900" hex="#0F172A" usage="Texte principal"/>
    <!-- Dark mode -->
    <color name="dark-bg" hex="#0B1120" usage="Background principal dark — plus profond que Tailwind default"/>
    <color name="dark-surface" hex="#151D2E" usage="Cards dark"/>
    <color name="dark-surface-hover" hex="#1C2640" usage="Cards dark hover"/>
    <color name="dark-border" hex="#1E293B" usage="Bordures dark"/>
  </color_palette>

  <!-- ============================================ -->
  <!-- TYPOGRAPHIE                                  -->
  <!-- ============================================ -->
  <typography>
    <font name="Inter" usage="UI, corps de texte" weights="400,500,600,700" variable="true"/>
    <font name="Cal Sans" usage="Titres marketing landing page uniquement" weights="600"/>
    <scale>
      xs=12px, sm=14px, base=16px, lg=18px, xl=20px, 2xl=24px, 3xl=30px, 4xl=36px, 5xl=48px
      Line-heights : tight=1.2 (titres), normal=1.5 (texte), relaxed=1.75 (lecture longue)
      Letter-spacing : titres=-0.025em, texte=normal
    </scale>
  </typography>

  <!-- ============================================ -->
  <!-- MICRO-INTERACTIONS ET ANIMATIONS             -->
  <!-- ============================================ -->
  <animations>
    <rule>CHAQUE interaction a un feedback. Pas d'action silencieuse.</rule>
    <animation name="task_complete" description="Checkbox → scale(1.2) + rotate(5deg) + confetti subtle (3-5 particles) + strikethrough animé. Durée 400ms ease-out. Son optionnel (off par défaut)."/>
    <animation name="task_create" description="Nouvelle carte slide-in depuis le bas + fade-in. Durée 300ms ease-out."/>
    <animation name="task_delete" description="Carte slide-out vers la droite + fade-out + height collapse smooth. Durée 250ms."/>
    <animation name="drag_drop" description="Carte lifted (shadow-xl + scale 1.02) pendant le drag. Drop = spring animation retour. Slot cible = highlight subtle."/>
    <animation name="ai_analysis_loading" description="
      PAS un simple spinner. Séquence engageante :
      1. Bouton Analyser → morphe en barre de progression
      2. Les 20 tâches sélectionnées pulsent doucement une par une (wave effect)
      3. Texte rotatif : 'Analyse de l'urgence...' → 'Estimation des durées...' → 'Classification Eisenhower...'
      4. Résultat : matrice apparaît avec stagger animation (chaque tâche tombe dans son quadrant)
      Durée totale : 3-8 secondes. L'animation MASQUE le temps d'attente.
    "/>
    <animation name="eisenhower_reveal" description="Matrice 2x2 fade-in. Tâches tombent dans leurs quadrants avec stagger delay 80ms + spring physics. Les risk_flag pulsent en rouge."/>
    <animation name="page_transition" description="Crossfade 200ms entre les routes. Pas de flash blanc."/>
    <animation name="sidebar_toggle" description="Slide + fade, 250ms ease-in-out. Contenu principal resize smooth."/>
    <animation name="toast_notification" description="Slide-in depuis le haut + auto-dismiss après 4s avec progress bar."/>
    <animation name="quota_warning" description="Badge quota pulse doucement quand &lt;2 analyses restantes. Glow AI violet."/>
    <animation name="upgrade_nudge" description="
      Quand l'utilisateur atteint une limite :
      - PAS de modal bloquant (frustrant)
      - Banner élégant en bas avec gradient primary→ai + texte + CTA 'Débloquer'
      - Dismiss possible, mais réapparaît subtilement après 3 actions
    "/>
  </animations>

  <!-- ============================================ -->
  <!-- COMPOSANTS UI PREMIUM                        -->
  <!-- ============================================ -->
  <ui_components>
    <cards>
      Coins arrondis lg (8px). Border subtle (neutral-200/dark-border).
      Ombre : shadow-sm par défaut, shadow-md au hover (transition 200ms).
      Dark mode : fond dark-surface, pas juste une inversion.
    </cards>
    <buttons>
      Primary : bg-primary-500, hover bg-primary-600, active bg-primary-700, transition 150ms.
      Padding généreux (px-6 py-3). Border-radius lg. Font-weight 600.
      AI buttons : gradient from-ai-500 to-primary-500 + subtle shimmer animation au hover.
      Disabled : opacity-50 + cursor-not-allowed. JAMAIS invisible.
      Ghost : pas de background, hover bg-neutral-100. Pour actions secondaires.
      Destructive : bg-danger + confirmation dialog TOUJOURS.
    </buttons>
    <inputs>
      Border neutral-200, focus ring-2 ring-primary-500 ring-offset-2. Transition 150ms.
      Placeholder text neutral-400. Label au-dessus, pas flottant (meilleure UX).
      Error state : border-danger + message en dessous (pas de tooltip).
    </inputs>
    <empty_states>
      CRITIQUES pour la première impression. Jamais un écran vide.
      Illustration minimaliste (SVG inline) + titre encourageant + CTA clair.
      Ex : "Aucune tâche pour l'instant" + illustration person+checklist + "Ajouter ma première tâche"
    </empty_states>
    <skeleton_loading>
      Shimmer animation (gradient translate-x) sur les placeholders.
      Structure fidèle au contenu réel (pas de blocs génériques).
      Durée visible minimum 300ms (éviter le flash).
    </skeleton_loading>
  </ui_components>

  <!-- ============================================ -->
  <!-- CONVERSION-DRIVEN DESIGN                     -->
  <!-- ============================================ -->
  <conversion_design>
    <principle>Chaque interaction gratuite montre subtilement la valeur du payant.</principle>
    <tactic name="ai_teaser">
      Après les 2 analyses gratuites, la matrice Eisenhower reste visible mais floutée
      avec un overlay : "Débloquer les analyses IA → 49€/an". PAS de blocage, juste du désir.
    </tactic>
    <tactic name="feature_gating_visual">
      Les features payantes sont VISIBLES en mode gratuit (calendrier mois, sync, export)
      mais avec un badge "Pro" discret et un lock icon élégant. Click → pricing modal.
    </tactic>
    <tactic name="progress_hook">
      Après 3 jours d'utilisation : banner "Tu as créé X tâches et complété Y.
      Avec l'IA, tu pourrais prioriser les Z restantes en 10 secondes." + CTA.
    </tactic>
    <tactic name="social_proof_subtle">
      Landing page : "Rejoint par X utilisateurs" (compteur réel ou réaliste).
      In-app : "Les utilisateurs Pro gagnent en moyenne 1h/semaine."
    </tactic>
    <tactic name="pricing_psychology">
      Annuel mis en avant (barré le mensuel). Badge "Meilleur choix" sur Pro.
      Toggle annuel/mensuel avec animation du prix qui descend.
      Prix affiché : "≈ 2 mois offerts" plutôt que juste -30%.
    </tactic>
  </conversion_design>

  <!-- ============================================ -->
  <!-- LANDING PAGE (HAUTE CONVERSION)              -->
  <!-- ============================================ -->
  <landing_page>
    <section name="hero">
      Titre Cal Sans 5xl (mobile: 3xl). Tagline en dessous.
      CTA primaire large + CTA secondaire ghost.
      Background : gradient mesh subtle (primary-50 → white) ou grain texture.
      Screenshot app flottant avec ombre réaliste (perspective 3D légère).
      Pas de carrousel. Pas de vidéo autoplay. Image statique premium.
    </section>
    <section name="proof_triptych">
      3 colonnes (mobile: stack). Icône + titre + description courte.
      1. Priorité IA (🎯) 2. Calendrier intégré (📅) 3. Domaines illimités (🏷)
      Animation : fade-in + slide-up au scroll (IntersectionObserver). Stagger 150ms.
    </section>
    <section name="demo">
      Screenshot interactif OU vidéo courte (15s max, autoplay muted, loop).
      Montrer : ajout tâche → lancement analyse → résultat matrice.
      Encadré avec bordure gradient ai-500→primary-500.
    </section>
    <section name="how_it_works">
      3 étapes numérotées. Grandes icônes. Design épuré.
      1. Domaines → 2. Deadlines → 3. IA analyse.
    </section>
    <section name="pricing">
      Composant PricingTable réutilisé. Toggle mensuel/annuel.
      Plan recommandé (Pro) visuellement proéminent : bordure gradient + badge + scale(1.02).
    </section>
    <section name="faq">
      Accordion shadcn/ui. 5-6 questions max. Ouverture smooth.
    </section>
    <section name="final_cta">
      Fond gradient dark (dark-bg). Titre blanc Cal Sans.
      Même tagline que hero. CTA large lumineux.
      "Commencer gratuitement — 2 analyses offertes"
    </section>
    <section name="footer">
      Minimal. Logo + liens légaux + contact.
    </section>
  </landing_page>

  <!-- ============================================ -->
  <!-- EISENHOWER MATRIX PREMIUM                    -->
  <!-- ============================================ -->
  <eisenhower>
    🔴 urgent_important : bg gradient red-50→red-100, border-left-4 red-500, glow subtle si risk_flag
    🔵 important_non_urgent : bg gradient blue-50→blue-100, border-left-4 blue-500
    🟡 urgent_non_important : bg gradient amber-50→amber-100, border-left-4 amber-500
    ⚪ ni_urgent_ni_important : bg neutral-50, border-left-4 neutral-300, opacity légèrement réduite
    Chaque quadrant : titre + compteur de tâches. Tâches cliquables (expand → détail).
    Légende en dessous avec explication 1 ligne par quadrant.
  </eisenhower>

  <!-- ============================================ -->
  <!-- RESPONSIVE PREMIUM                           -->
  <!-- ============================================ -->
  <responsive>
    mobile(&lt;640px): Stack vertical, bottom nav 5 items (icônes Lucide), FAB +tâche en bas-droite,
      swipe gestures (swipe right=complete, swipe left=delete avec confirm),
      sheet bottom pour formulaires (pas de page entière).
    tablet(&lt;1024px): Sidebar collapsible, grid 2 colonnes pour la matrice.
    desktop(≥1025px): Sidebar fixe 280px, contenu centré max-w-5xl, matrice 2x2 full.
    TOUS : Transitions smooth entre breakpoints. Pas de layout shift visible.
  </responsive>

</design>
```

---

## SECTION 9 — CONVENTIONS

```xml
<conventions>
  Naming: Components=PascalCase, hooks=usePrefix, utils=camelCase, routes=kebab, db=snake_case, env=SCREAMING
  TS: strict, no any, Zod runtime, types dans src/types/
  React: Fonctionnel, props typées, hooks custom, Zustand global, lazy loading
  Errors: Try/catch, classes custom, toast user, console.error system
  Git: feat:/fix:/refactor:/docs:/test:/chore:, atomiques, main=prod
</conventions>
```

---

## SECTION 10 — DEV SETUP

```
# .env.example
NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY / NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY / STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Commandes
npm run dev | build | test | test:e2e | lint
npx supabase db push | db reset
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## SECTION 11 — VALIDATION GATES

```xml
<gates>
  <gate phase="1" name="MVP Local">
    FONCTIONNEL :
    [ ] npm run build — zéro erreur
    [ ] npm run test — tous les tests QA-01 passent (coverage 80%+)
    [ ] CRUD tâches fonctionnel (créer, modifier, supprimer, filtrer)
    [ ] CRUD domaines fonctionnel (3 par défaut, limite 3)
    [ ] Drag and drop réordonner (spring animation visible)
    [ ] Persistance IndexedDB (refresh = données conservées)
    [ ] Navigation entre les 4 routes (crossfade transition)
    DESIGN PREMIUM :
    [ ] Responsive : 320px + 768px + 1280px — pas de layout shift
    [ ] Dark mode premium (pas une simple inversion, palette dark dédiée)
    [ ] Empty states avec illustration SVG + CTA sur chaque écran vide
    [ ] Skeleton loading avec shimmer animation sur les listes
    [ ] Micro-interactions : task create (slide-in), delete (slide-out), complete (scale + check)
    [ ] Touch targets ≥44px sur mobile
    [ ] Fonts Inter chargée en preload + display swap
    SÉCURITÉ :
    [ ] npm audit : 0 vulnérabilité high/critical
    [ ] Pas de console.log avec données sensibles
    [ ] TypeScript strict : 0 erreur, 0 any
  </gate>

  <gate phase="2" name="Calendrier + Rappels">
    FONCTIONNEL :
    [ ] Vue semaine avec tâches positionnées par deadline
    [ ] Vue mois avec indicateurs de charge par jour
    [ ] Conflict badges visibles (2+ deadlines même jour)
    [ ] Drag and drop calendrier = mise à jour deadline
    [ ] Rappels via Notification API fonctionnels
    [ ] Tests QA-02 passent
    DESIGN PREMIUM :
    [ ] Jour surchargé : badge pulsant rouge avec compteur
    [ ] Animation drag sur calendrier : ghost card + slot highlight
    [ ] Transition smooth entre vue semaine ↔ mois
  </gate>

  <gate phase="3" name="Auth + IA">
    FONCTIONNEL :
    [ ] Inscription/connexion (email + Google OAuth)
    [ ] Migration local → cloud proposée au premier login
    [ ] Analyse IA : sélection → résultat en &lt; 10s
    [ ] Matrice Eisenhower affichée correctement (4 quadrants)
    [ ] "Appliquer" met à jour les tâches
    [ ] Quotas respectés (2 analyses gratuit, blocage ensuite)
    [ ] Tests QA-03 passent
    DESIGN PREMIUM :
    [ ] Animation analyse IA complète : bouton morphe → wave sur tâches → texte rotatif → matrice stagger reveal
    [ ] Risk flags : pulsent en rouge dans la matrice
    [ ] Quota indicator : glow violet quand &lt;2 restantes
    [ ] Upgrade nudge élégant (banner gradient, pas modal bloquant) quand quota épuisé
    SÉCURITÉ :
    [ ] RLS testé : user A ne voit pas les données de user B
    [ ] Password policy : rejet si &lt;8 chars ou pas de complexité
    [ ] Brute force : lock après 5 tentatives (tester)
    [ ] SUPABASE_SERVICE_ROLE_KEY absent de tout fichier client (grep vérifié)
    [ ] Prompt injection : "ignore previous instructions" dans titre → analyse normale
    [ ] Zod validation sur /api/ai/analyze (tester avec payload invalide)
    [ ] Réponse IA validée avant utilisation (pas de code/HTML exécuté)
  </gate>

  <gate phase="4" name="Paiements">
    FONCTIONNEL :
    [ ] Checkout Stripe fonctionnel (mode test)
    [ ] Webhook sync statut → plan mis à jour
    [ ] Upgrade free → IA Quotidienne → Pro
    [ ] Limites ajustées dynamiquement après upgrade
    [ ] Coupon étudiant fonctionne
    [ ] Tests QA-04 + QA-05 passent
    DESIGN PREMIUM :
    [ ] PricingTable : plan Pro visuellement dominant (scale + gradient border + badge "Meilleur choix")
    [ ] Toggle annuel/mensuel avec animation prix
    [ ] Feature gating : features Pro visibles mais lockées (badge Pro + lock icon)
    SÉCURITÉ :
    [ ] Webhook Stripe : signature invalide → rejet 400
    [ ] Idempotency keys sur checkout creation
    [ ] STRIPE_SECRET_KEY absent côté client (grep vérifié)
    [ ] Checkout session créée côté serveur uniquement
    [ ] Rate limiting auth : 429 après 20 req/min
  </gate>

  <gate phase="5" name="Sync + Export + PWA">
    FONCTIONNEL :
    [ ] Sync push/pull entre 2 navigateurs (Pro)
    [ ] Export CSV téléchargeable
    [ ] Export PDF formaté avec matrice
    [ ] App installable (PWA) sur mobile
    [ ] Push notifications reçues
    [ ] Tests QA-06 passent
    SÉCURITÉ :
    [ ] Sync : uniquement les données de l'utilisateur authentifié (RLS vérifié)
    [ ] Export : accessible uniquement au propriétaire des données
    [ ] Service worker : pas de cache de données sensibles
    DESIGN PREMIUM :
    [ ] Install prompt PWA stylé (pas le default browser)
    [ ] Export PDF : mise en page professionnelle avec logo + matrice couleurs
  </gate>

  <gate phase="6" name="Lancement">
    FONCTIONNEL :
    [ ] Landing page live avec tous les CTAs fonctionnels
    [ ] Funnel complet testable bout en bout (inscription → analyse → upgrade)
    DESIGN PREMIUM :
    [ ] Lighthouse : Performance >90, Accessibility >90, Best Practices >90, SEO >90
    [ ] Hero impactant : Cal Sans, gradient mesh, screenshot perspective 3D
    [ ] Animations scroll : fade-in + slide-up staggered (IntersectionObserver)
    [ ] Pricing table premium (Pro dominant, toggle animé)
    [ ] Final CTA : fond dark gradient, contraste maximal
    [ ] OG image 1200x630 professionnelle
    SÉCURITÉ :
    [ ] CSP headers configurés et fonctionnels
    [ ] HSTS activé (vérifier curl -I)
    [ ] X-Frame-Options: DENY
    [ ] 0 console.log en production
    [ ] 0 secret exposé côté client (audit complet)
    [ ] npm audit production : 0 high/critical
    [ ] Structured data JSON-LD valide (test Google Rich Results)
    [ ] CORS : pas de wildcard en production
  </gate>
</gates>
```

---

## SECTION 12 — INSTRUCTION DE LANCEMENT

> **Pour démarrer la construction, copier-coller dans Claude Code :**
>
> Tu es le Lead Orchestrator du projet Multitasks.fr. Lis le CLAUDE.md complet.
> Active le mode delegate (Shift+Tab) — tu ne codes JAMAIS.
>
> **Lance la Phase 1** :
> 1. Crée l'équipe : `multitasks-build`
> 2. Crée les tâches F-01 à F-03 + FE-01 à FE-04 + QA-01 dans la task list
> 3. Spawne `foundation-agent` avec son spawn_prompt (section 0.2)
> 4. Quand F-01 terminé, spawne `frontend-agent` avec son spawn_prompt
> 5. Quand toutes les tâches Phase 1 terminées, spawne `qa-agent` pour QA-01
> 6. Valide la gate Phase 1 (section 11)
> 7. Annonce "Phase 1 validée" et enchaîne Phase 2 (même pattern)
>
> **Continue phase par phase jusqu'à la Phase 6.**
> Respecte les FILE_OWNERSHIP, les dépendances entre tâches, et les protocoles de communication.
> Si un agent est bloqué 3+ fois → STOP, analyse, reformule.
> Objectif final : application complète, testée, deployable, commercialisable.
