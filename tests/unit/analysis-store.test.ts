import { describe, it, expect, beforeEach } from "vitest";
import { useAnalysisStore } from "@/stores/analysis-store";

describe("analysis-store", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset the store state between tests
    useAnalysisStore.setState({
      status: "idle",
      result: null,
      analysisMetadata: null,
      error: null,
      history: [],
    });
  });

  it("initial state: status est idle", () => {
    const state = useAnalysisStore.getState();
    expect(state.status).toBe("idle");
  });

  it("initial state: result est null", () => {
    const state = useAnalysisStore.getState();
    expect(state.result).toBeNull();
  });

  it("initial state: analysisMetadata est null", () => {
    const state = useAnalysisStore.getState();
    expect(state.analysisMetadata).toBeNull();
  });

  it("initial state: error est null", () => {
    const state = useAnalysisStore.getState();
    expect(state.error).toBeNull();
  });

  it("clearAnalysis remet status a idle", () => {
    useAnalysisStore.setState({ status: "done" });
    useAnalysisStore.getState().clearAnalysis();
    expect(useAnalysisStore.getState().status).toBe("idle");
  });

  it("clearAnalysis remet result a null", () => {
    useAnalysisStore.setState({
      result: {
        tasks: [],
        summary: "test",
        conflict_warnings: [],
      } as never,
    });
    useAnalysisStore.getState().clearAnalysis();
    expect(useAnalysisStore.getState().result).toBeNull();
  });

  it("clearAnalysis remet analysisMetadata a null", () => {
    useAnalysisStore.setState({
      analysisMetadata: {
        tokensUsed: 100,
        durationMs: 500,
        model: "test",
        taskCount: 1,
      },
    });
    useAnalysisStore.getState().clearAnalysis();
    expect(useAnalysisStore.getState().analysisMetadata).toBeNull();
  });

  it("clearAnalysis remet error a null", () => {
    useAnalysisStore.setState({ error: "some error" });
    useAnalysisStore.getState().clearAnalysis();
    expect(useAnalysisStore.getState().error).toBeNull();
  });

  it("refreshQuota met a jour quotaInfo", () => {
    const state = useAnalysisStore.getState();
    state.refreshQuota();
    const updated = useAnalysisStore.getState();
    expect(updated.quotaInfo).toBeDefined();
    expect(updated.quotaInfo.plan).toBe("free");
  });
});
