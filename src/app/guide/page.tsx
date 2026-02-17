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
    description: "Inscription, connexion et prise en main",
    content: [
      {
        subtitle: "Créer un compte",
        text: "Rendez-vous sur la page d'inscription. Entrez votre email et un mot de passe (8 caractères minimum avec majuscule, chiffre et caractère spécial). Vous pouvez aussi vous inscrire via Google en un clic.",
      },
      {
        subtitle: "Se connecter",
        text: "Utilisez votre email et mot de passe, ou connectez-vous via Google. Un lien magique (magic link) peut aussi vous être envoyé par email pour une connexion sans mot de passe.",
      },
      {
        subtitle: "Découvrir l'interface",
        text: "Après connexion, vous arrivez sur le tableau de bord. La barre latérale (desktop) ou la navigation en bas (mobile) vous permet d'accéder aux Tâches, au Calendrier, à l'Analyse IA, aux Domaines et aux Paramètres.",
      },
    ],
  },
  {
    id: "gestion-taches",
    icon: CheckSquare,
    title: "Gestion des tâches",
    description: "Créer, modifier et organiser vos tâches",
    content: [
      {
        subtitle: "Créer une tâche",
        text: "Cliquez sur le bouton \"+\" ou \"Ajouter une tâche\". Renseignez le titre, une description optionnelle, le domaine associé, la deadline, la durée estimée et la priorité.",
      },
      {
        subtitle: "Modifier une tâche",
        text: "Cliquez sur une tâche pour ouvrir le détail. Modifiez n'importe quel champ : titre, description, domaine, deadline, durée, priorité ou statut.",
      },
      {
        subtitle: "Statuts disponibles",
        text: "Chaque tâche passe par les statuts : À faire → En cours → Terminée. Vous pouvez aussi annuler une tâche. Cochez la case pour marquer une tâche comme terminée rapidement.",
      },
      {
        subtitle: "Réorganiser par drag & drop",
        text: "Maintenez et glissez une tâche pour changer son ordre. L'ordre est sauvegardé automatiquement.",
      },
      {
        subtitle: "Supprimer une tâche",
        text: "Ouvrez le détail de la tâche et cliquez sur Supprimer. Une confirmation vous sera demandée avant la suppression définitive.",
      },
    ],
  },
  {
    id: "domaines",
    icon: Tags,
    title: "Domaines",
    description: "Organiser vos tâches par catégorie",
    content: [
      {
        subtitle: "Qu'est-ce qu'un domaine ?",
        text: "Les domaines sont des catégories pour regrouper vos tâches : Pro, Perso, Urgent, etc. Chaque domaine a un nom, une couleur et une icône personnalisables.",
      },
      {
        subtitle: "Créer un domaine",
        text: "Allez dans l'onglet Domaines. Cliquez sur \"Ajouter un domaine\", choisissez un nom, une couleur et une icône parmi la bibliothèque Lucide.",
      },
      {
        subtitle: "Assigner un domaine à une tâche",
        text: "Lors de la création ou modification d'une tâche, sélectionnez le domaine dans le menu déroulant. Un badge coloré apparaît sur la carte de la tâche.",
      },
      {
        subtitle: "Limites par plan",
        text: "Le plan gratuit inclut 3 domaines. Les plans payants (IA Quotidienne et Pro Sync) offrent un nombre illimité de domaines.",
      },
    ],
  },
  {
    id: "analyse-ia",
    icon: Sparkles,
    title: "Analyse IA",
    description: "Priorisez vos tâches avec l'intelligence artificielle",
    content: [
      {
        subtitle: "Sélectionner les tâches",
        text: "Dans la section Analyse IA, cochez jusqu'à 20 tâches que vous souhaitez prioriser. Plus vous fournissez de contexte (deadlines, durées, descriptions), meilleure sera l'analyse.",
      },
      {
        subtitle: "Lancer l'analyse",
        text: "Cliquez sur \"Analyser\". L'IA traite vos tâches en moins de 10 secondes et les classe selon la matrice d'Eisenhower (urgent/important).",
      },
      {
        subtitle: "Comprendre la matrice d'Eisenhower",
        text: "Les tâches sont réparties en 4 quadrants : Urgent & Important (faire maintenant), Important & Non urgent (planifier), Urgent & Non important (déléguer), Ni urgent ni important (éliminer).",
      },
      {
        subtitle: "Appliquer les recommandations",
        text: "Cliquez sur \"Appliquer\" pour mettre à jour automatiquement les priorités, durées estimées et prochaines actions suggérées par l'IA sur vos tâches.",
      },
      {
        subtitle: "Quotas d'analyses",
        text: "Plan Gratuit : 2 analyses à vie. Plan IA Quotidienne : 8 analyses par mois. Plan Pro Sync : 3 analyses par jour. Des packs supplémentaires sont disponibles à l'achat.",
      },
    ],
  },
  {
    id: "calendrier",
    icon: Calendar,
    title: "Calendrier",
    description: "Visualisez vos deadlines et planifiez votre semaine",
    content: [
      {
        subtitle: "Vue semaine",
        text: "La vue semaine affiche vos tâches jour par jour avec leurs deadlines. Disponible sur tous les plans.",
      },
      {
        subtitle: "Vue mois",
        text: "La vue mois offre une vision globale de votre charge. Chaque jour affiche un indicateur du nombre de tâches. Disponible sur les plans payants.",
      },
      {
        subtitle: "Détecter les conflits",
        text: "Un badge d'alerte apparaît quand 2 tâches ou plus ont la même deadline, ou quand la charge dépasse 8h dans une journée. Réorganisez pour éviter la surcharge.",
      },
      {
        subtitle: "Déplacer par drag & drop",
        text: "Glissez une tâche d'un jour à l'autre dans le calendrier pour modifier sa deadline rapidement.",
      },
    ],
  },
  {
    id: "rappels",
    icon: Bell,
    title: "Rappels",
    description: "Ne manquez plus jamais une deadline",
    content: [
      {
        subtitle: "Rappels automatiques",
        text: "Si votre tâche a une deadline et une durée estimée, le rappel se déclenche automatiquement : deadline - durée - 30 minutes. Si seule la deadline est définie, le rappel est envoyé 24h avant.",
      },
      {
        subtitle: "Rappels manuels",
        text: "Vous pouvez définir une date et heure de rappel personnalisées pour n'importe quelle tâche, indépendamment de la deadline.",
      },
      {
        subtitle: "Notifications",
        text: "Les rappels utilisent les notifications du navigateur. Autorisez les notifications à la première demande pour les recevoir. Sur mobile (PWA), les notifications push sont supportées.",
      },
      {
        subtitle: "Limites par plan",
        text: "Plan Gratuit : 1 rappel par jour. Plan IA Quotidienne : 5 rappels par jour. Plan Pro Sync : rappels illimités.",
      },
    ],
  },
  {
    id: "plans-tarifs",
    icon: CreditCard,
    title: "Plans & Tarifs",
    description: "Choisissez le plan adapté à vos besoins",
    content: [
      {
        subtitle: "Plan Gratuit — 0\u00a0\u20ac",
        text: "3 domaines, 60 tâches, 2 analyses IA à vie, 1 rappel/jour, vue semaine, stockage local. Idéal pour découvrir l'application. Aucune carte bancaire requise.",
      },
      {
        subtitle: "Plan IA Quotidienne — 5,90\u00a0\u20ac/mois ou 49\u00a0\u20ac/an",
        text: "Domaines illimités, tâches illimitées, 8 analyses IA/mois, 5 rappels/jour, calendrier complet (semaine + mois), stockage local.",
      },
      {
        subtitle: "Plan Pro Sync — 12,90\u00a0\u20ac/mois ou 99\u00a0\u20ac/an",
        text: "Tout illimité : 3 analyses IA/jour, rappels illimités, synchronisation cloud multi-appareil, export CSV et PDF, support prioritaire.",
      },
      {
        subtitle: "Changer de plan",
        text: "Rendez-vous dans Paramètres > Abonnement pour upgrader ou changer de formule. La différence est calculée au prorata. Annulation en 2 clics, satisfait ou remboursé 30 jours.",
      },
      {
        subtitle: "Packs d'analyses supplémentaires",
        text: "Besoin de plus d'analyses ? Achetez des packs : 10 analyses pour 4,90\u00a0\u20ac ou 30 analyses pour 9,90\u00a0\u20ac. Utilisables sans limite de temps.",
      },
    ],
  },
  {
    id: "synchronisation-export",
    icon: Cloud,
    title: "Synchronisation & Export",
    description: "Accédez à vos données partout",
    content: [
      {
        subtitle: "Synchronisation multi-appareil",
        text: "Avec le plan Pro Sync, vos tâches et domaines sont synchronisés automatiquement entre tous vos appareils (ordinateur, tablette, téléphone). La synchronisation est incrémentale et en temps réel.",
      },
      {
        subtitle: "Fonctionnement local-first",
        text: "Multitasks fonctionne d'abord en local (IndexedDB). Vos données sont disponibles même sans connexion internet. La synchronisation cloud se fait en arrière-plan quand la connexion est rétablie.",
      },
      {
        subtitle: "Export CSV",
        text: "Exportez toutes vos tâches au format CSV pour les analyser dans Excel, Google Sheets ou tout autre tableur. Inclut toutes les métadonnées : domaine, statut, priorité, deadline, etc.",
      },
      {
        subtitle: "Export PDF",
        text: "Générez un rapport PDF de votre dernière analyse IA, incluant la matrice d'Eisenhower et les recommandations. Idéal pour le partager ou l'imprimer.",
      },
    ],
  },
  {
    id: "installation-mobile",
    icon: Smartphone,
    title: "Installation mobile",
    description: "Installez Multitasks comme une application native",
    content: [
      {
        subtitle: "Qu'est-ce qu'une PWA ?",
        text: "Multitasks est une Progressive Web App (PWA). Cela signifie que vous pouvez l'installer sur votre téléphone comme une application native, sans passer par l'App Store ou Google Play.",
      },
      {
        subtitle: "Installer sur iOS (Safari)",
        text: "Ouvrez multitasks.fr dans Safari. Appuyez sur le bouton Partager (carré avec flèche), puis \"Sur l'écran d'accueil\". L'icône Multitasks apparaît sur votre écran d'accueil.",
      },
      {
        subtitle: "Installer sur Android (Chrome)",
        text: "Ouvrez multitasks.fr dans Chrome. Un bandeau \"Installer Multitasks\" apparaît automatiquement. Sinon, appuyez sur le menu ⋮ puis \"Installer l'application\".",
      },
      {
        subtitle: "Mode hors-ligne",
        text: "Une fois installée, l'application fonctionne même sans connexion internet. Vos tâches sont stockées localement et se synchronisent automatiquement à la reconnexion (plan Pro Sync).",
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
              Tout ce qu&apos;il faut savoir pour tirer le meilleur de
              Multitasks.
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
                Prêt à gagner du temps ?
              </h2>
              <p className="relative mb-8 text-lg text-neutral-400">
                Commencez gratuitement avec 2 analyses IA offertes.
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
