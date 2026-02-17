import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: "Découvrez comment Multitasks protège vos données personnelles. Politique RGPD, cookies, et droits des utilisateurs.",
  alternates: {
    canonical: "https://multitasks.fr/legal/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0B1120] px-6 py-20 text-neutral-100 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-neutral-400 transition-colors hover:text-white"
        >
          &larr; Retour
        </Link>

        <h1 className="mb-4 text-4xl font-bold text-white">
          Politique de confidentialité
        </h1>
        <p className="mb-12 text-sm text-neutral-400">
          Dernière mise à jour : 14 février 2026
        </p>

        <div className="space-y-8 text-neutral-300 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_p]:leading-relaxed [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1">
          <section>
            <h2>1. Responsable du traitement</h2>
            <p>
              Christophe Tunica, éditeur de Multitasks.
              <br />
              Contact : contact@multitasks.fr
            </p>
          </section>

          <section>
            <h2>2. Données collectées</h2>
            <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
            <ul>
              <li>Adresse email et nom d&apos;affichage (inscription)</li>
              <li>Données de tâches et domaines (contenu utilisateur)</li>
              <li>Données de facturation (gérées par Stripe)</li>
            </ul>
          </section>

          <section>
            <h2>3. Finalités du traitement</h2>
            <ul>
              <li>Fourniture et amélioration du service</li>
              <li>Gestion de votre compte et de votre abonnement</li>
              <li>Analyse IA de vos tâches (envoi des titres et descriptions à l&apos;API OpenAI)</li>
              <li>Communication relative au service (emails transactionnels)</li>
            </ul>
          </section>

          <section>
            <h2>4. Base légale</h2>
            <p>
              Le traitement repose sur l&apos;exécution du contrat (fourniture du
              service) et votre consentement explicite lors de l&apos;inscription.
            </p>
          </section>

          <section>
            <h2>5. Analyse IA</h2>
            <p>
              Lors d&apos;une analyse, les titres et descriptions de vos tâches
              sont envoyés à l&apos;API OpenAI (GPT-4o-mini). Vos données ne sont ni
              stockées ni utilisées pour l&apos;entraînement des modèles par
              OpenAI.
            </p>
          </section>

          <section>
            <h2>6. Partage des données</h2>
            <p>Vos données sont partagées uniquement avec :</p>
            <ul>
              <li>Supabase (hébergement base de données, UE)</li>
              <li>Stripe (paiements sécurisés)</li>
              <li>OpenAI (analyse IA, traitement ponctuel)</li>
              <li>Vercel (hébergement application)</li>
            </ul>
            <p>Aucune donnée n&apos;est vendue à des tiers.</p>
          </section>

          <section>
            <h2>7. Durée de conservation</h2>
            <p>
              Vos données sont conservées tant que votre compte est actif. En cas
              de suppression du compte, toutes les données sont supprimées sous 24
              heures.
            </p>
          </section>

          <section>
            <h2>8. Vos droits (RGPD)</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (suppression du compte)</li>
              <li>Droit à la portabilité (export CSV)</li>
              <li>Droit d&apos;opposition et de limitation du traitement</li>
            </ul>
            <p>
              Pour exercer vos droits, contactez-nous à contact@multitasks.fr.
            </p>
          </section>

          <section>
            <h2>9. Cookies</h2>
            <p>
              Multitasks utilise uniquement des cookies strictement nécessaires au
              fonctionnement (session d&apos;authentification). Aucun cookie
              analytics ou marketing n&apos;est utilisé. Vercel Analytics est
              privacy-friendly et ne dépose aucun cookie.
            </p>
          </section>

          <section>
            <h2>10. Sécurité</h2>
            <p>
              Vos données sont chiffrées en transit (TLS 1.3) et au repos
              (AES-256). L&apos;accès est protégé par Row Level Security sur
              toutes les tables de la base de données.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              Pour toute question relative à vos données personnelles :
              contact@multitasks.fr
            </p>
            <p>
              Vous pouvez également adresser une réclamation à la CNIL :
              www.cnil.fr
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
