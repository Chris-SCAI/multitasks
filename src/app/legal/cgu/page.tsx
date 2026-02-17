import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Consultez les conditions générales d'utilisation de Multitasks, l'application de gestion de tâches avec priorisation IA.",
  alternates: {
    canonical: "https://multitasks.fr/legal/cgu",
  },
};

export default function CGUPage() {
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
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="mb-12 text-sm text-neutral-400">
          Dernière mise à jour : 14 février 2026
        </p>

        <div className="space-y-8 text-neutral-300 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_p]:leading-relaxed">
          <section>
            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent
              l&apos;accès et l&apos;utilisation du service Multitasks, accessible à
              l&apos;adresse multitasks.fr. En utilisant le service, vous acceptez
              sans réserve les présentes CGU.
            </p>
          </section>

          <section>
            <h2>2. Éditeur</h2>
            <p>
              Multitasks est édité par Christophe Tunica, entrepreneur individuel.
              <br />
              Contact : contact@multitasks.fr
            </p>
          </section>

          <section>
            <h2>3. Description du service</h2>
            <p>
              Multitasks est une application de gestion de tâches avec priorisation
              par intelligence artificielle. Le service propose une offre gratuite
              et des offres payantes dont les détails sont disponibles sur la page
              Tarifs.
            </p>
          </section>

          <section>
            <h2>4. Inscription et compte</h2>
            <p>
              L&apos;inscription est gratuite. Vous êtes responsable de la
              confidentialité de vos identifiants. Toute activité réalisée depuis
              votre compte est sous votre responsabilité.
            </p>
          </section>

          <section>
            <h2>5. Utilisation du service</h2>
            <p>
              Vous vous engagez à utiliser le service conformément à sa
              destination. Toute utilisation abusive, frauduleuse ou contraire aux
              lois en vigueur pourra entraîner la suspension ou la suppression de
              votre compte.
            </p>
          </section>

          <section>
            <h2>6. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu du site (textes, graphismes, logiciels,
              marques) est la propriété de Multitasks ou de ses partenaires. Toute
              reproduction non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2>7. Données personnelles</h2>
            <p>
              Le traitement de vos données personnelles est décrit dans notre{" "}
              <Link
                href="/legal/privacy"
                className="text-violet-400 underline hover:text-violet-300"
              >
                Politique de confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2>8. Limitation de responsabilité</h2>
            <p>
              Le service est fourni &quot;en l&apos;état&quot;. Multitasks ne
              saurait être tenu responsable des interruptions, erreurs ou pertes de
              données. Les résultats de l&apos;analyse IA sont des suggestions et
              ne constituent pas des conseils professionnels.
            </p>
          </section>

          <section>
            <h2>9. Modification des CGU</h2>
            <p>
              Multitasks se réserve le droit de modifier les présentes CGU. Les
              utilisateurs seront informés par email de toute modification
              substantielle.
            </p>
          </section>

          <section>
            <h2>10. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige,
              les tribunaux français seront seuls compétents.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
