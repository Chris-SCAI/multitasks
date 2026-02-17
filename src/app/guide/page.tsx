"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Rocket,
  CheckSquare,
  Tags,
  Sparkles,
  Calendar,
  Bell,
  CreditCard,
  Cloud,
  Smartphone,
} from "lucide-react";

const sections = [
  {
    id: "premiers-pas",
    icon: Rocket,
    title: "Premiers pas",
    description: "Créez votre compte et découvrez votre espace de travail",
    content: [
      {
        subtitle: "Créer votre compte",
        text: "Rendez-vous sur la page d'inscription et saisissez votre adresse email ainsi qu'un mot de passe sécurisé (8 caractères minimum, incluant au moins une majuscule, un chiffre et un caractère spécial). Votre compte est prêt en quelques secondes, sans carte bancaire.",
      },
      {
        subtitle: "Se connecter",
        text: "Deux options s'offrent à vous : la connexion classique par email et mot de passe, ou le lien magique. Ce dernier vous envoie un lien de connexion unique par email, valable 10 minutes, pour accéder à votre compte sans mot de passe.",
      },
      {
        subtitle: "Mot de passe oublié",
        text: "Depuis la page de connexion, cliquez sur \"Mot de passe oublié\". Un email de réinitialisation vous sera envoyé. Le lien est à usage unique et expire au bout d'une heure pour des raisons de sécurité.",
      },
      {
        subtitle: "Découvrir l'interface",
        text: "Après connexion, vous accédez au tableau de bord. Sur ordinateur, la barre latérale gauche vous donne accès aux cinq sections principales : Tâches, Calendrier, Analyse IA, Domaines et Paramètres. Sur mobile, cette navigation se retrouve en bas de l'écran pour un accès rapide du pouce.",
      },
    ],
  },
  {
    id: "gestion-taches",
    icon: CheckSquare,
    title: "Gestion des tâches",
    description: "Créez, organisez et suivez toutes vos tâches au quotidien",
    content: [
      {
        subtitle: "Ajouter une tâche",
        text: "Cliquez sur le bouton d'ajout pour ouvrir le formulaire de création. Renseignez un titre (obligatoire), puis enrichissez votre tâche avec une description, un domaine, une deadline, une durée estimée et un niveau de priorité. Plus vos tâches sont détaillées, plus l'analyse IA sera pertinente.",
      },
      {
        subtitle: "Modifier ou compléter une tâche",
        text: "Cliquez sur une tâche pour ouvrir sa fiche détaillée. Chaque champ est modifiable : titre, description, domaine, deadline, durée, priorité et statut. Les modifications sont sauvegardées instantanément.",
      },
      {
        subtitle: "Suivre l'avancement avec les statuts",
        text: "Chaque tâche progresse à travers trois statuts : \"À faire\" pour les tâches planifiées, \"En cours\" pour celles sur lesquelles vous travaillez activement, et \"Terminée\" une fois accomplies. Pour marquer rapidement une tâche comme terminée, cochez directement sa case depuis la liste.",
      },
      {
        subtitle: "Réorganiser par glisser-déposer",
        text: "Maintenez une tâche enfoncée puis glissez-la pour modifier son ordre dans la liste. La nouvelle position est sauvegardée automatiquement. Cette fonctionnalité vous permet de placer visuellement vos priorités du jour en haut de liste.",
      },
      {
        subtitle: "Filtrer et rechercher",
        text: "Utilisez les filtres pour afficher uniquement les tâches d'un statut, d'une priorité ou d'un domaine spécifique. La barre de recherche permet de retrouver une tâche par son titre ou sa description.",
      },
      {
        subtitle: "Supprimer une tâche",
        text: "Depuis la fiche détaillée, cliquez sur le bouton de suppression. Une confirmation vous est demandée pour éviter toute suppression accidentelle. Cette action est irréversible.",
      },
    ],
  },
  {
    id: "domaines",
    icon: Tags,
    title: "Domaines",
    description: "Structurez vos tâches par sphères de responsabilité",
    content: [
      {
        subtitle: "Le principe des domaines",
        text: "Les domaines vous permettent de catégoriser vos tâches par sphère de vie ou de responsabilité. Chaque domaine possède un nom, une couleur distinctive et une icône, pour identifier en un coup d'oeil à quel contexte appartient chaque tâche.",
      },
      {
        subtitle: "Domaines par défaut",
        text: "À la création de votre compte, trois domaines sont prêts à l'emploi : Personnel, Professionnel et Études. Vous pouvez les renommer, en modifier les couleurs et icônes, ou les supprimer selon vos besoins.",
      },
      {
        subtitle: "Créer et personnaliser un domaine",
        text: "Depuis la section Domaines, cliquez sur \"Ajouter un domaine\". Choisissez un nom explicite, une couleur parmi la palette proposée et une icône dans la bibliothèque intégrée. Le badge coloré apparaîtra ensuite sur chaque tâche associée.",
      },
      {
        subtitle: "Associer un domaine à une tâche",
        text: "Lors de la création ou de la modification d'une tâche, sélectionnez le domaine dans le menu déroulant. Un badge coloré s'affiche sur la carte de la tâche, facilitant le repérage visuel dans votre liste.",
      },
      {
        subtitle: "Limites selon votre plan",
        text: "Le plan Gratuit permet de créer jusqu'à 3 domaines. Les plans IA Quotidienne et Pro Sync vous offrent un nombre illimité de domaines pour une organisation sans contrainte.",
      },
    ],
  },
  {
    id: "analyse-ia",
    icon: Sparkles,
    title: "Analyse IA",
    description: "Laissez l'intelligence artificielle prioriser vos tâches en 10 secondes",
    content: [
      {
        subtitle: "Préparer l'analyse",
        text: "Depuis la section Analyse IA, cochez les tâches que vous souhaitez prioriser (jusqu'à 20 par analyse). Pour des résultats optimaux, assurez-vous que vos tâches comportent un titre clair, une deadline si applicable et une durée estimée. L'IA exploite ces informations pour évaluer l'urgence et l'importance de chaque tâche.",
      },
      {
        subtitle: "Lancer l'analyse",
        text: "Cliquez sur le bouton \"Analyser\". L'IA traite vos tâches en quelques secondes et les classe selon la matrice d'Eisenhower. Une animation de progression vous accompagne pendant le traitement : analyse de l'urgence, estimation des durées, puis classification finale.",
      },
      {
        subtitle: "Lire la matrice d'Eisenhower",
        text: "Vos tâches sont réparties en quatre quadrants. \"Urgent et Important\" : à traiter immédiatement. \"Important, Non urgent\" : à planifier avec soin. \"Urgent, Non important\" : à déléguer si possible. \"Ni urgent, Ni important\" : à reconsidérer ou éliminer. Les tâches comportant un risque (deadline imminente ou surcharge) sont signalées par un indicateur rouge.",
      },
      {
        subtitle: "Appliquer les recommandations",
        text: "Cliquez sur \"Appliquer\" pour mettre à jour automatiquement vos tâches avec les priorités, durées estimées et prochaines actions suggérées par l'IA. L'ordre de vos tâches est également réorganisé selon le plan d'action recommandé.",
      },
      {
        subtitle: "Quotas d'analyses par plan",
        text: "Le plan Gratuit inclut 2 analyses offertes à vie pour découvrir la fonctionnalité. Le plan IA Quotidienne offre 8 analyses par mois, renouvelées automatiquement. Le plan Pro Sync donne accès à 3 analyses par jour pour une priorisation au fil de l'eau.",
      },
    ],
  },
  {
    id: "calendrier",
    icon: Calendar,
    title: "Calendrier",
    description: "Visualisez votre charge et anticipez les conflits de planning",
    content: [
      {
        subtitle: "Vue semaine",
        text: "La vue semaine affiche vos tâches jour par jour en fonction de leurs deadlines. Naviguez entre les semaines pour anticiper votre charge de travail. Cette vue est disponible sur tous les plans, y compris le plan Gratuit.",
      },
      {
        subtitle: "Vue mois",
        text: "La vue mois offre une vision d'ensemble de votre planning. Chaque jour affiche un indicateur de charge reflétant le nombre de tâches et le temps estimé. Disponible sur les plans IA Quotidienne et Pro Sync.",
      },
      {
        subtitle: "Détection automatique des conflits",
        text: "Multitasks identifie automatiquement les journées problématiques : un badge d'alerte apparaît lorsque deux tâches ou plus partagent la même deadline, ou lorsque la charge estimée dépasse 8 heures dans une journée. Cet indicateur visuel vous aide à rééquilibrer votre planning avant qu'il ne soit trop tard.",
      },
      {
        subtitle: "Réorganiser par glisser-déposer",
        text: "Déplacez directement une tâche d'un jour à l'autre dans le calendrier pour ajuster sa deadline. La modification est enregistrée instantanément et la détection de conflits se met à jour en conséquence.",
      },
    ],
  },
  {
    id: "rappels",
    icon: Bell,
    title: "Rappels",
    description: "Recevez des notifications avant chaque deadline importante",
    content: [
      {
        subtitle: "Rappels intelligents",
        text: "Multitasks calcule automatiquement le moment idéal pour vous rappeler une tâche. Si votre tâche a une deadline et une durée estimée, le rappel se déclenche selon la formule : deadline moins durée moins 30 minutes de marge. Si seule la deadline est renseignée, le rappel est envoyé 24 heures avant l'échéance.",
      },
      {
        subtitle: "Rappels personnalisés",
        text: "Vous pouvez également définir manuellement une date et une heure de rappel pour n'importe quelle tâche, indépendamment de sa deadline. Utile pour les tâches sans échéance fixe que vous ne voulez pas oublier.",
      },
      {
        subtitle: "Activer les notifications",
        text: "Les rappels s'affichent via les notifications de votre navigateur. Lors de la première utilisation, autorisez les notifications lorsque le navigateur vous le demande. Les rappels sont envoyés tant que l'application est ouverte dans un onglet de votre navigateur.",
      },
      {
        subtitle: "Limites selon votre plan",
        text: "Le plan Gratuit permet 1 rappel par jour. Le plan IA Quotidienne monte à 5 rappels par jour. Le plan Pro Sync offre des rappels illimités pour ne jamais rien laisser passer.",
      },
    ],
  },
  {
    id: "plans-tarifs",
    icon: CreditCard,
    title: "Plans & Tarifs",
    description: "Trois formules pour s'adapter à chaque besoin, de l'essentiel au complet",
    content: [
      {
        subtitle: "Plan Gratuit",
        text: "Commencez sans engagement : 3 domaines, jusqu'à 60 tâches, 2 analyses IA offertes à vie, 1 rappel par jour et la vue calendrier semaine. Toutes vos données sont stockées localement sur votre appareil. Aucune carte bancaire requise.",
      },
      {
        subtitle: "Plan IA Quotidienne \u2014 5,90\u00a0\u20ac/mois ou 49\u00a0\u20ac/an",
        text: "Passez à la vitesse supérieure : domaines et tâches illimités, 8 analyses IA par mois (renouvelées automatiquement), 5 rappels par jour et le calendrier complet avec vues semaine et mois. Vos données restent stockées localement.",
      },
      {
        subtitle: "Plan Pro Sync \u2014 12,90\u00a0\u20ac/mois ou 99\u00a0\u20ac/an",
        text: "L'expérience complète : tout est illimité, avec 3 analyses IA par jour, des rappels sans restriction, la synchronisation cloud entre tous vos appareils, l'export de vos données en CSV et PDF, et un support prioritaire. Le choix des professionnels exigeants.",
      },
      {
        subtitle: "Changer de plan ou annuler",
        text: "Depuis Paramètres > Abonnement, vous pouvez upgrader votre plan à tout moment. L'annulation se fait en deux clics, sans engagement. Tous les plans payants bénéficient de la garantie satisfait ou remboursé pendant 30 jours.",
      },
    ],
  },
  {
    id: "synchronisation-export",
    icon: Cloud,
    title: "Synchronisation & Export",
    description: "Retrouvez vos données sur tous vos appareils et exportez-les facilement",
    content: [
      {
        subtitle: "Architecture local-first",
        text: "Multitasks stocke vos données en priorité sur votre appareil grâce à IndexedDB. L'application reste pleinement fonctionnelle même sans connexion internet : vos tâches, domaines et analyses sont toujours accessibles localement.",
      },
      {
        subtitle: "Synchronisation cloud (Pro Sync)",
        text: "Avec le plan Pro Sync, synchronisez vos données entre votre ordinateur, votre tablette et votre téléphone. Depuis Paramètres > Synchronisation, lancez la synchronisation pour mettre à jour vos appareils. Le système utilise un mécanisme incrémental basé sur la date de dernière modification de chaque élément.",
      },
      {
        subtitle: "Export CSV",
        text: "Exportez l'ensemble de vos tâches au format CSV depuis Paramètres > Données. Le fichier inclut toutes les informations : titre, description, domaine, statut, priorité, deadline, durée estimée et dates de création. Compatible avec Excel, Google Sheets et tout tableur.",
      },
      {
        subtitle: "Export PDF",
        text: "Générez un rapport PDF structuré à partir de votre dernière analyse IA. Le document inclut la matrice d'Eisenhower, les recommandations de priorisation et le plan d'action. Pratique pour le partager avec un manager ou le conserver comme référence.",
      },
    ],
  },
  {
    id: "installation-mobile",
    icon: Smartphone,
    title: "Installation mobile",
    description: "Utilisez Multitasks comme une application native sur votre téléphone",
    content: [
      {
        subtitle: "Une application web progressive (PWA)",
        text: "Multitasks est conçu comme une Progressive Web App : vous pouvez l'installer directement sur l'écran d'accueil de votre téléphone, sans passer par l'App Store ni le Google Play Store. L'application se lance en plein écran, comme une application native.",
      },
      {
        subtitle: "Installer sur iPhone (Safari)",
        text: "Ouvrez multitasks.fr dans Safari. Appuyez sur le bouton de partage (l'icône carré avec une flèche vers le haut), puis sélectionnez \"Sur l'écran d'accueil\". Confirmez en appuyant sur \"Ajouter\". L'icône Multitasks apparaît alors sur votre écran d'accueil.",
      },
      {
        subtitle: "Installer sur Android (Chrome)",
        text: "Ouvrez multitasks.fr dans Chrome. Une bannière d'installation s'affiche automatiquement en bas de l'écran. Si elle n'apparaît pas, appuyez sur le menu (trois points verticaux en haut à droite) puis sur \"Installer l'application\" ou \"Ajouter à l'écran d'accueil\".",
      },
      {
        subtitle: "Utilisation hors connexion",
        text: "Vos tâches et domaines sont stockés localement sur votre appareil. Vous pouvez donc consulter et modifier vos données même en l'absence de connexion internet. Les abonnés Pro Sync pourront synchroniser leurs modifications une fois la connexion rétablie.",
      },
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="relative min-h-screen bg-[#0B1120] px-6 py-20 text-neutral-100 sm:px-8 lg:px-12">
      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 20, -15, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-20 -translate-x-1/2"
        >
          <div className="h-[400px] w-[600px] rounded-full bg-violet-600/8 blur-[120px]" />
        </motion.div>
        <motion.div
          animate={{ x: [0, -25, 15, 0], y: [0, 10, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 top-1/2"
        >
          <div className="h-[300px] w-[300px] rounded-full bg-blue-600/8 blur-[100px]" />
        </motion.div>
      </div>

      {/* Grid dot pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Retour
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
            <BookOpen className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">
              Guide d&apos;utilisation
            </h1>
            <p className="mt-1 text-lg text-neutral-400">
              Maîtrisez chaque fonctionnalité pour organiser, prioriser et
              avancer efficacement.
            </p>
          </div>
        </motion.div>

        {/* Quick navigation grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const el = document.getElementById(section.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#151D2E] px-4 py-3 text-left transition-all duration-200 hover:border-violet-500/30 hover:bg-[#1C2640]"
            >
              <section.icon className="size-5 shrink-0 text-violet-400 transition-colors group-hover:text-violet-300" />
              <span className="text-sm font-medium text-neutral-300 transition-colors group-hover:text-white">
                {section.title}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Accordion sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="space-y-5">
            {sections.map((section, index) => (
              <AccordionItem
                key={section.id}
                id={section.id}
                value={section.id}
                className="scroll-mt-24 rounded-2xl border border-[#1E293B] bg-[#151D2E] px-8 py-4 transition-all duration-200 data-[state=open]:border-violet-500/30 data-[state=open]:bg-[#1C2640]"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10">
                      <section.icon className="size-5 text-violet-400" />
                    </div>
                    <div>
                      <span className="text-xl font-bold text-neutral-100 lg:text-2xl">
                        {section.title}
                      </span>
                      <p className="mt-0.5 text-sm text-neutral-400">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-6 pl-14">
                    {section.content.map((item, i) => (
                      <div key={i}>
                        <h3 className="mb-1.5 text-base font-semibold text-violet-300">
                          {item.subtitle}
                        </h3>
                        <p className="text-base leading-relaxed text-neutral-300 lg:text-lg">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="relative rounded-2xl">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-violet-500/30 to-blue-500/30" />
            <div className="relative overflow-hidden rounded-2xl bg-[#151D2E] px-8 py-12">
              <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-violet-600 opacity-[0.05] blur-3xl" />
              <h2 className="relative mb-3 text-2xl font-bold text-white sm:text-3xl">
                Prêt à reprendre le contrôle de vos priorités ?
              </h2>
              <p className="relative mb-8 text-lg text-neutral-400">
                Créez votre compte en 30 secondes et recevez 2 analyses IA
                offertes.
              </p>
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40"
              >
                <Link href="/register" className="inline-flex items-center gap-2">
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center gap-2">
                    Commencer gratuitement
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
