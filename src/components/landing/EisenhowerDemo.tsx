"use client";

export function EisenhowerDemo() {
  const quadrants = [
    {
      title: "Urgent + Important",
      color: "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20",
      borderColor: "border-l-red-500",
      tasks: ["Corriger le bug critique", "Préparer réunion client"],
    },
    {
      title: "Important (pas urgent)",
      color: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20",
      borderColor: "border-l-blue-500",
      tasks: ["Planifier stratégie Q2", "Formation développement"],
    },
    {
      title: "Urgent (pas important)",
      color:
        "from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20",
      borderColor: "border-l-amber-500",
      tasks: ["Répondre email collègue", "Approuver dépenses"],
    },
    {
      title: "Ni urgent ni important",
      color:
        "from-neutral-50 to-neutral-100 dark:from-neutral-900/20 dark:to-neutral-800/20",
      borderColor: "border-l-neutral-300 dark:border-l-neutral-600",
      tasks: ["Trier ancien emails", "Réorganiser bureau"],
    },
  ];

  return (
    <div
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-[#151D2E]"
      style={{
        transform: "perspective(1000px) rotateX(2deg) rotateY(-2deg)",
      }}
    >
      <div className="bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">
          Matrice d'Eisenhower - Analyse IA
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-px bg-neutral-200 p-px dark:bg-neutral-700 sm:grid-cols-2">
        {quadrants.map((quadrant, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${quadrant.color} border-l-4 ${quadrant.borderColor} p-4`}
          >
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {quadrant.title}
            </h4>
            <ul className="space-y-2">
              {quadrant.tasks.map((task, taskIndex) => (
                <li
                  key={taskIndex}
                  className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                >
                  <span className="mt-0.5 inline-block size-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
