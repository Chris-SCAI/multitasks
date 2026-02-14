import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
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
          Politique de confidentialite
        </h1>
        <p className="mb-12 text-sm text-neutral-400">
          Derniere mise a jour : 14 fevrier 2026
        </p>

        <div className="space-y-8 text-neutral-300 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_p]:leading-relaxed [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1">
          <section>
            <h2>1. Responsable du traitement</h2>
            <p>
              Christophe Tunica, editeur de Multitasks.
              <br />
              Contact : contact@multitasks.fr
            </p>
          </section>

          <section>
            <h2>2. Donnees collectees</h2>
            <p>Nous collectons uniquement les donnees necessaires au fonctionnement du service :</p>
            <ul>
              <li>Adresse email et nom d&apos;affichage (inscription)</li>
              <li>Donnees de taches et domaines (contenu utilisateur)</li>
              <li>Donnees de facturation (gerees par Stripe)</li>
            </ul>
          </section>

          <section>
            <h2>3. Finalites du traitement</h2>
            <ul>
              <li>Fourniture et amelioration du service</li>
              <li>Gestion de votre compte et de votre abonnement</li>
              <li>Analyse IA de vos taches (envoi des titres et descriptions a l&apos;API Anthropic)</li>
              <li>Communication relative au service (emails transactionnels)</li>
            </ul>
          </section>

          <section>
            <h2>4. Base legale</h2>
            <p>
              Le traitement repose sur l&apos;execution du contrat (fourniture du
              service) et votre consentement explicite lors de l&apos;inscription.
            </p>
          </section>

          <section>
            <h2>5. Analyse IA</h2>
            <p>
              Lors d&apos;une analyse, les titres et descriptions de vos taches
              sont envoyes a l&apos;API Anthropic (Claude). Vos donnees ne sont ni
              stockees ni utilisees pour l&apos;entrainement des modeles par
              Anthropic.
            </p>
          </section>

          <section>
            <h2>6. Partage des donnees</h2>
            <p>Vos donnees sont partagees uniquement avec :</p>
            <ul>
              <li>Supabase (hebergement base de donnees, UE)</li>
              <li>Stripe (paiements securises)</li>
              <li>Anthropic (analyse IA, traitement ponctuel)</li>
              <li>Vercel (hebergement application)</li>
            </ul>
            <p>Aucune donnee n&apos;est vendue a des tiers.</p>
          </section>

          <section>
            <h2>7. Duree de conservation</h2>
            <p>
              Vos donnees sont conservees tant que votre compte est actif. En cas
              de suppression du compte, toutes les donnees sont supprimees sous 24
              heures.
            </p>
          </section>

          <section>
            <h2>8. Vos droits (RGPD)</h2>
            <p>Conformement au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li>Droit d&apos;acces a vos donnees</li>
              <li>Droit de rectification</li>
              <li>Droit a l&apos;effacement (suppression du compte)</li>
              <li>Droit a la portabilite (export CSV)</li>
              <li>Droit d&apos;opposition et de limitation du traitement</li>
            </ul>
            <p>
              Pour exercer vos droits, contactez-nous a contact@multitasks.fr.
            </p>
          </section>

          <section>
            <h2>9. Cookies</h2>
            <p>
              Multitasks utilise uniquement des cookies strictement necessaires au
              fonctionnement (session d&apos;authentification). Aucun cookie
              analytics ou marketing n&apos;est utilise. Vercel Analytics est
              privacy-friendly et ne depose aucun cookie.
            </p>
          </section>

          <section>
            <h2>10. Securite</h2>
            <p>
              Vos donnees sont chiffrees en transit (TLS 1.3) et au repos
              (AES-256). L&apos;acces est protege par Row Level Security sur
              toutes les tables de la base de donnees.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              Pour toute question relative a vos donnees personnelles :
              contact@multitasks.fr
            </p>
            <p>
              Vous pouvez egalement adresser une reclamation a la CNIL :
              www.cnil.fr
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
