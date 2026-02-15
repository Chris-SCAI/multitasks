"use client";

import { useTaskStore } from "@/stores/task-store";
import { useAnalysisStore } from "@/stores/analysis-store";
import { AnalysisLauncher } from "@/components/analysis/AnalysisLauncher";
import { AnalysisResult } from "@/components/analysis/AnalysisResult";
import { AILoadingAnimation } from "@/components/analysis/AILoadingAnimation";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalysisPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const { status, result, quotaInfo, runAnalysis, clearAnalysis, applyAnalysis } =
    useAnalysisStore();

  const activeTasks = tasks.filter((t) => t.status !== "done");

  function handleAnalyze(taskIds: string[]) {
    const selectedTasks = tasks.filter((t) => taskIds.includes(t.id));
    runAnalysis(taskIds, selectedTasks);
  }

  async function handleApply() {
    await applyAnalysis(updateTask);
  }

  function handleNewAnalysis() {
    clearAnalysis();
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {status === "loading" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AILoadingAnimation />
          </motion.div>
        ) : status === "done" && result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnalysisResult
              analysis={result}
              tasks={tasks}
              onApply={handleApply}
              onNewAnalysis={handleNewAnalysis}
            />
          </motion.div>
        ) : (
          <motion.div
            key="launcher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnalysisLauncher
              tasks={activeTasks}
              onAnalyze={handleAnalyze}
              isAnalyzing={false}
              quotaInfo={quotaInfo}
            />
            {status === "error" && (
              <div role="alert" aria-live="assertive" className="mt-4 rounded-lg border border-red-900/50 bg-red-900/20 p-3 text-base text-red-400">
                {useAnalysisStore.getState().error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
