import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Generales d'Utilisation",
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
          Conditions Generales d&apos;Utilisation
        </h1>
        <p className="mb-12 text-sm text-neutral-400">
          Derniere mise a jour : 14 fevrier 2026
        </p>

        <div className="space-y-8 text-neutral-300 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_p]:leading-relaxed">
          <section>
            <h2>1. Objet</h2>
            <p>
              Les presentes Conditions Generales d&apos;Utilisation (CGU) regissent
              l&apos;acces et l&apos;utilisation du service Multitasks, accessible a
              l&apos;adresse multitasks.fr. En utilisant le service, vous acceptez
              sans reserve les presentes CGU.
            </p>
          </section>

          <section>
            <h2>2. Editeur</h2>
            <p>
              Multitasks est edite par Christophe Tunica, entrepreneur individuel.
              <br />
              Contact : contact@multitasks.fr
            </p>
          </section>

          <section>
            <h2>3. Description du service</h2>
            <p>
              Multitasks est une application de gestion de taches avec priorisation
              par intelligence artificielle. Le service propose une offre gratuite
              et des offres payantes dont les details sont disponibles sur la page
              Tarifs.
            </p>
          </section>

          <section>
            <h2>4. Inscription et compte</h2>
            <p>
              L&apos;inscription est gratuite. Vous etes responsable de la
              confidentialite de vos identifiants. Toute activite realisee depuis
              votre compte est sous votre responsabilite.
            </p>
          </section>

          <section>
            <h2>5. Utilisation du service</h2>
            <p>
              Vous vous engagez a utiliser le service conformement a sa
              destination. Toute utilisation abusive, frauduleuse ou contraire aux
              lois en vigueur pourra entrainer la suspension ou la suppression de
              votre compte.
            </p>
          </section>

          <section>
            <h2>6. Propriete intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu du site (textes, graphismes, logiciels,
              marques) est la propriete de Multitasks ou de ses partenaires. Toute
              reproduction non autorisee est interdite.
            </p>
          </section>

          <section>
            <h2>7. Donnees personnelles</h2>
            <p>
              Le traitement de vos donnees personnelles est decrit dans notre{" "}
              <Link
                href="/legal/privacy"
                className="text-violet-400 underline hover:text-violet-300"
              >
                Politique de confidentialite
              </Link>
              .
            </p>
          </section>

          <section>
            <h2>8. Limitation de responsabilite</h2>
            <p>
              Le service est fourni &quot;en l&apos;etat&quot;. Multitasks ne
              saurait etre tenu responsable des interruptions, erreurs ou pertes de
              donnees. Les resultats de l&apos;analyse IA sont des suggestions et
              ne constituent pas des conseils professionnels.
            </p>
          </section>

          <section>
            <h2>9. Modification des CGU</h2>
            <p>
              Multitasks se reserve le droit de modifier les presentes CGU. Les
              utilisateurs seront informes par email de toute modification
              substantielle.
            </p>
          </section>

          <section>
            <h2>10. Droit applicable</h2>
            <p>
              Les presentes CGU sont soumises au droit francais. En cas de litige,
              les tribunaux francais seront seuls competents.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
