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
    description: "Créez votre compte et prenez en main votre espace de travail",
    content: [
      {
        subtitle: "Créer votre compte",
        text: "Depuis la page \"Créez votre compte gratuitement\", renseignez votre nom, votre email et choisissez un mot de passe. Un indicateur visuel vous guide en temps réel sur les critères requis : 8 caractères minimum, 1 majuscule, 1 chiffre et 1 caractère spécial. Confirmez votre mot de passe puis cliquez sur \"Créer mon compte\". Un email de confirmation vous est envoyé : cliquez sur le lien pour activer votre compte.",
      },
      {
        subtitle: "Se connecter",
        text: "Sur la page de connexion, saisissez votre email et votre mot de passe puis cliquez sur \"Se connecter\". Vous préférez ne pas retenir de mot de passe ? Cliquez sur \"Magic link\" : un lien de connexion unique, valable 10 minutes, vous est envoyé par email.",
      },
      {
        subtitle: "Mot de passe oublié",
        text: "Depuis la page de connexion, cliquez sur \"Mot de passe oublié ?\". Saisissez votre email : un lien de réinitialisation à usage unique vous est envoyé. Il expire au bout d'une heure.",
      },
      {
        subtitle: "Naviguer dans l'application",
        text: "Après connexion, vous arrivez sur votre tableau de bord. Sur ordinateur, la barre latérale gauche affiche les sections : Tâches, Calendrier, Analyse IA, Domaines, Guide et Paramètres. Sur mobile, ces mêmes sections sont accessibles via la barre de navigation en bas de l'écran.",
      },
    ],
  },
  {
    id: "gestion-taches",
    icon: CheckSquare,
    title: "Gestion des tâches",
    description: "Créez, organisez et suivez l'avancement de toutes vos tâches",
    content: [
      {
        subtitle: "Créer une nouvelle tâche",
        text: "Cliquez sur le bouton d'ajout pour ouvrir la fenêtre \"Nouvelle tâche\". Le champ Titre est obligatoire (placeholder : \"Que devez-vous faire ?\"). Complétez avec une Description (\"Détails supplémentaires...\"), choisissez une Priorité (Basse, Moyenne, Haute ou Urgente), un Domaine, une Échéance et une Durée estimée en minutes. Cliquez sur \"Ajouter\" pour enregistrer ou \"Annuler\" pour fermer sans sauvegarder.",
      },
      {
        subtitle: "Modifier une tâche",
        text: "Cliquez sur une tâche existante pour ouvrir la fenêtre \"Modifier la tâche\". Tous les champs sont modifiables : titre, description, priorité, domaine, échéance et durée estimée. Validez vos changements en cliquant sur \"Modifier\".",
      },
      {
        subtitle: "Suivre l'avancement",
        text: "Chaque tâche passe par trois statuts : \"À faire\" pour les tâches planifiées, \"En cours\" pour celles en traitement, et \"Terminée\" une fois accomplies. Pour marquer rapidement une tâche comme terminée, cochez directement sa case depuis la liste. Utilisez les filtres Statut et Priorité pour afficher uniquement les tâches qui vous intéressent, ou tapez dans le champ \"Rechercher une tâche...\" pour retrouver une tâche précise. Le bouton \"Effacer les filtres\" réinitialise l'affichage.",
      },
      {
        subtitle: "Réorganiser par glisser-déposer",
        text: "Maintenez une tâche enfoncée puis glissez-la vers le haut ou le bas de la liste pour modifier son ordre. La nouvelle position est sauvegardée automatiquement.",
      },
      {
        subtitle: "Supprimer une tâche",
        text: "Cliquez sur le bouton \"Supprimer\" depuis la carte de la tâche. Une confirmation vous est demandée avant la suppression définitive. Cette action est irréversible.",
      },
    ],
  },
  {
    id: "domaines",
    icon: Tags,
    title: "Domaines",
    description: "Catégorisez vos tâches par sphère de responsabilité",
    content: [
      {
        subtitle: "Le principe des domaines",
        text: "Les domaines regroupent vos tâches par contexte : vie professionnelle, personnelle, études, etc. Chaque domaine possède un nom, une couleur et une icône qui s'affichent sous forme de badge sur chaque tâche associée. L'en-tête de la section affiche votre utilisation : par exemple \"2/3 domaines (Gratuit)\".",
      },
      {
        subtitle: "Domaines par défaut",
        text: "Trois domaines sont créés automatiquement à votre arrivée : Personnel, Professionnel et Études. Vous pouvez les modifier, les renommer ou les supprimer librement.",
      },
      {
        subtitle: "Créer un nouveau domaine",
        text: "Cliquez sur \"Ajouter un domaine\" pour ouvrir la fenêtre \"Nouveau domaine\". Renseignez un Nom (ex : \"Sport, Famille...\"), choisissez une Couleur dans la palette et sélectionnez une Icône. Cliquez sur \"Ajouter\" pour valider.",
      },
      {
        subtitle: "Associer un domaine à une tâche",
        text: "Dans la fenêtre de création ou de modification d'une tâche, utilisez le menu déroulant Domaine (\"Choisir un domaine\") pour l'associer. Le badge coloré du domaine s'affiche alors sur la carte de la tâche.",
      },
      {
        subtitle: "Limites selon votre plan",
        text: "Le plan Gratuit permet jusqu'à 3 domaines. Les plans IA Quotidienne et Pro Sync offrent des domaines illimités.",
      },
    ],
  },
  {
    id: "analyse-ia",
    icon: Sparkles,
    title: "Analyse IA",
    description: "Obtenez une priorisation Eisenhower de vos tâches en quelques secondes",
    content: [
      {
        subtitle: "Sélectionner les tâches à analyser",
        text: "Depuis la section Analyse IA, la description indique : \"Sélectionnez les tâches à analyser pour obtenir une priorisation Eisenhower.\" Cochez les tâches souhaitées (jusqu'à 20). Un compteur affiche votre sélection en temps réel (ex : \"5/20 tâches sélectionnées\"). Les boutons \"Tout sélectionner\" et \"Tout désélectionner\" accélèrent la sélection. Pour des résultats optimaux, renseignez un titre clair, une échéance et une durée estimée sur vos tâches.",
      },
      {
        subtitle: "Lancer l'analyse",
        text: "Cliquez sur \"Analyser avec l'IA (X tâches)\". Une animation de progression vous accompagne pendant le traitement : analyse de l'urgence, estimation des durées, puis classification. Le résultat s'affiche en quelques secondes sous forme de matrice d'Eisenhower. Si votre quota est épuisé, le bouton affiche \"Quota épuisé\" et un lien \"Débloquer\" vous oriente vers les plans supérieurs.",
      },
      {
        subtitle: "Lire les résultats",
        text: "Vos tâches sont classées en quatre quadrants : \"Urgent & Important\" (à traiter immédiatement), \"Important\" (à planifier), \"Urgent\" (à déléguer si possible), et \"Autre\" (à reconsidérer). Les tâches à risque (deadline imminente ou surcharge) sont signalées par un indicateur rouge. Un résumé de l'analyse et un ordre de traitement suggéré complètent la matrice.",
      },
      {
        subtitle: "Appliquer les suggestions",
        text: "Cliquez sur \"Appliquer les suggestions\" pour mettre à jour automatiquement vos tâches : priorités, durées estimées, prochaines actions et ordre de traitement sont reportés. Cliquez sur \"Nouvelle analyse\" pour relancer une analyse avec une autre sélection.",
      },
      {
        subtitle: "Quotas d'analyses",
        text: "L'indicateur de quota affiche vos analyses restantes (ex : \"2/2 analyses restantes\"). Plan Gratuit : 2 analyses offertes à vie. Plan IA Quotidienne : 8 analyses par mois, renouvelées automatiquement. Plan Pro Sync : 3 analyses par jour.",
      },
    ],
  },
  {
    id: "calendrier",
    icon: Calendar,
    title: "Calendrier",
    description: "\"Visualisez vos tâches par semaine ou par mois\"",
    content: [
      {
        subtitle: "Vue Semaine",
        text: "L'onglet \"Semaine\" affiche vos tâches jour par jour en fonction de leurs échéances. Utilisez les flèches de navigation ou le bouton \"Aujourd'hui\" pour vous déplacer dans le temps. Si aucune tâche n'a de deadline sur la période, l'écran affiche : \"Aucune deadline cette semaine\" avec un bouton pour ajouter des échéances. Disponible sur tous les plans.",
      },
      {
        subtitle: "Vue Mois",
        text: "L'onglet \"Mois\" offre une vue d'ensemble de votre planning. Chaque jour affiche un indicateur de charge avec le nombre de tâches et le temps estimé. Disponible sur les plans IA Quotidienne et Pro Sync.",
      },
      {
        subtitle: "Détection des conflits",
        text: "Un badge d'alerte apparaît automatiquement lorsque deux tâches ou plus partagent la même échéance, ou lorsque la charge estimée dépasse 8 heures dans une journée. Le tooltip détaille la situation : par exemple \"Journée surchargée : 9h estimées (5 tâches)\".",
      },
      {
        subtitle: "Déplacer une tâche",
        text: "Glissez-déposez une tâche d'un jour à l'autre pour modifier son échéance instantanément. La détection des conflits se met à jour en conséquence.",
      },
    ],
  },
  {
    id: "rappels",
    icon: Bell,
    title: "Rappels",
    description: "Recevez une notification avant chaque échéance importante",
    content: [
      {
        subtitle: "Rappels automatiques",
        text: "Multitasks calcule automatiquement le meilleur moment pour vous alerter. Si votre tâche a une échéance et une durée estimée, le rappel se déclenche selon la formule : échéance moins durée estimée moins 30 minutes de marge. Si seule l'échéance est renseignée, le rappel est envoyé 24 heures avant.",
      },
      {
        subtitle: "Rappels personnalisés",
        text: "Vous pouvez définir manuellement une date et une heure de rappel pour n'importe quelle tâche, indépendamment de son échéance.",
      },
      {
        subtitle: "Activer les notifications",
        text: "Les rappels utilisent les notifications de votre navigateur. Autorisez les notifications lorsque l'application vous le demande. Les rappels sont déclenchés tant que Multitasks est ouvert dans un onglet de votre navigateur.",
      },
      {
        subtitle: "Limites selon votre plan",
        text: "Plan Gratuit : 1 rappel par jour. Plan IA Quotidienne : 5 rappels par jour. Plan Pro Sync : rappels illimités.",
      },
    ],
  },
  {
    id: "plans-tarifs",
    icon: CreditCard,
    title: "Plans & Tarifs",
    description: "Trois formules claires, un toggle Mensuel / Annuel avec ~2 mois offerts",
    content: [
      {
        subtitle: "Plan Gratuit",
        text: "\"Pour découvrir Multitasks\" : 3 domaines, 60 tâches, 2 analyses IA (à vie), vue semaine et stockage local. Aucune carte bancaire requise.",
      },
      {
        subtitle: "Plan IA Quotidienne \u2014 5,90\u00a0\u20ac/mois ou 49\u00a0\u20ac/an",
        text: "\"Pour les utilisateurs réguliers\" : domaines illimités, tâches illimitées, 8 analyses IA par mois, 5 rappels par jour, calendrier complet (Semaine + Mois), stockage local. En tarif annuel, soit 4,08\u00a0\u20ac/mois.",
      },
      {
        subtitle: "Plan Pro Sync \u2014 12,90\u00a0\u20ac/mois ou 99\u00a0\u20ac/an",
        text: "\"Pour les professionnels exigeants\" \u2014 badge \"Meilleur choix\" : tout illimité, 3 analyses IA par jour, rappels illimités, synchronisation cloud multi-appareils, export CSV + PDF et support prioritaire. En tarif annuel, soit 8,25\u00a0\u20ac/mois. Offre \u00e9tudiante : 49\u00a0\u20ac/an.",
      },
      {
        subtitle: "Gérer votre abonnement",
        text: "Depuis Paramètres > onglet Abonnement, consultez votre plan actuel et vos analyses restantes. Cliquez sur \"Changer de plan\" pour upgrader, ou sur \"Annuler l'abonnement\" pour revenir au plan Gratuit. L'annulation prend effet à la fin de la période payée. Garantie satisfait ou remboursé 30 jours.",
      },
    ],
  },
  {
    id: "synchronisation-export",
    icon: Cloud,
    title: "Synchronisation & Export",
    description: "Synchronisez vos appareils et exportez vos données en un clic",
    content: [
      {
        subtitle: "Stockage local-first",
        text: "Multitasks stocke toutes vos données en local sur votre appareil. L'application fonctionne pleinement sans connexion internet : vos tâches, domaines et analyses restent accessibles en permanence.",
      },
      {
        subtitle: "Synchronisation cloud (Pro Sync)",
        text: "Avec le plan Pro Sync, retrouvez vos données sur tous vos appareils. Depuis Paramètres > onglet Sync, consultez le statut de connexion (\"Connecté\" ou \"Non synchronisé\"), la date du dernier sync et le nombre de changements en attente. Cliquez sur \"Synchroniser maintenant\" pour lancer la synchronisation.",
      },
      {
        subtitle: "Export CSV",
        text: "Depuis Paramètres > onglet Données, cliquez sur \"Export CSV\". Le fichier téléchargé contient l'ensemble de vos tâches avec toutes les informations : titre, description, domaine, statut, priorité, échéance, durée estimée et dates. Compatible Excel, Google Sheets et tout tableur. Réservé au plan Pro Sync.",
      },
      {
        subtitle: "Export PDF",
        text: "Cliquez sur \"Export PDF\" pour générer un rapport structuré incluant vos tâches et votre dernière analyse IA avec la matrice d'Eisenhower. Réservé au plan Pro Sync.",
      },
    ],
  },
  {
    id: "installation-mobile",
    icon: Smartphone,
    title: "Installation mobile",
    description: "Installez Multitasks sur votre téléphone en quelques secondes",
    content: [
      {
        subtitle: "Application web progressive",
        text: "Multitasks est une Progressive Web App (PWA). Vous pouvez l'installer sur l'écran d'accueil de votre téléphone sans passer par l'App Store ni le Play Store. L'application se lance en plein écran, comme une application native. Une bannière \"Installer Multitasks\" avec le message \"Accédez à vos tâches instantanément, même hors ligne\" s'affiche automatiquement.",
      },
      {
        subtitle: "Installer sur iPhone (Safari)",
        text: "Ouvrez multitasks.fr dans Safari. Appuyez sur le bouton de partage (carré avec flèche), puis sélectionnez \"Sur l'écran d'accueil\". Confirmez en appuyant sur \"Ajouter\".",
      },
      {
        subtitle: "Installer sur Android (Chrome)",
        text: "Ouvrez multitasks.fr dans Chrome. Appuyez sur \"Installer l'application\" dans la bannière qui s'affiche, ou ouvrez le menu (trois points verticaux) puis \"Installer l'application\".",
      },
      {
        subtitle: "Utilisation hors connexion",
        text: "Vos tâches et domaines sont stockés localement. Vous pouvez consulter et modifier vos données sans connexion internet. Les abonnés Pro Sync pourront synchroniser leurs modifications au retour de la connexion via le bouton \"Synchroniser maintenant\" dans les paramètres.",
      },
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="relative">
      <div className="relative mx-auto max-w-4xl">
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

