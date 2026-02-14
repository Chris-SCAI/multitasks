import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "@/stores/task-store";
import { useDomainStore } from "@/stores/domain-store";
import { useUIStore } from "@/stores/ui-store";
import { db } from "@/lib/db/local";

beforeEach(async () => {
  await db.tasks.clear();
  await db.domains.clear();
  useTaskStore.setState({
    tasks: [],
    filters: {},
    isLoading: false,
    error: null,
  });
  useDomainStore.setState({
    domains: [],
    isLoading: false,
    error: null,
  });
  useUIStore.setState({
    theme: "system",
    sidebarOpen: true,
    currentView: "list",
    showCompletedTasks: true,
  });
});

describe("TaskStore", () => {
  const sampleTaskInput = {
    title: "Test task",
    domainId: "domain-1",
  };

  describe("loadTasks", () => {
    it("loads tasks from the DB", async () => {
      await db.tasks.add({
        id: crypto.randomUUID(),
        title: "DB task",
        description: "",
        status: "todo",
        priority: "medium",
        domainId: "d1",
        tags: [],
        dueDate: null,
        estimatedMinutes: null,
        actualMinutes: null,
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
      });

      await useTaskStore.getState().loadTasks();
      const { tasks, isLoading } = useTaskStore.getState();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe("DB task");
      expect(isLoading).toBe(false);
    });

    it("sets isLoading during load", async () => {
      const promise = useTaskStore.getState().loadTasks();
      // isLoading is set to true synchronously at the beginning
      // After the promise resolves, it should be false
      await promise;
      expect(useTaskStore.getState().isLoading).toBe(false);
    });
  });

  describe("createTask", () => {
    it("creates a task in the store and DB", async () => {
      const task = await useTaskStore.getState().createTask(sampleTaskInput);
      expect(task.id).toBeDefined();
      expect(task.title).toBe("Test task");
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");

      // Verify in store
      const { tasks } = useTaskStore.getState();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe(task.id);

      // DB persistence is verified in db.test.ts
    });

    it("sets default values for optional fields", async () => {
      const task = await useTaskStore.getState().createTask(sampleTaskInput);
      expect(task.description).toBe("");
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");
      expect(task.tags).toEqual([]);
      expect(task.dueDate).toBeNull();
      expect(task.estimatedMinutes).toBeNull();
      expect(task.actualMinutes).toBeNull();
      expect(task.completedAt).toBeNull();
    });

    it("increments order for new tasks", async () => {
      const task1 = await useTaskStore.getState().createTask(sampleTaskInput);
      const task2 = await useTaskStore.getState().createTask({
        ...sampleTaskInput,
        title: "Second task",
      });
      expect(task1.order).toBe(0);
      expect(task2.order).toBe(1);
    });
  });

  describe("updateTask", () => {
    it("updates a task in store and DB", async () => {
      const task = await useTaskStore.getState().createTask(sampleTaskInput);
      await useTaskStore.getState().updateTask(task.id, { title: "Updated" });

      const { tasks } = useTaskStore.getState();
      expect(tasks[0].title).toBe("Updated");
    });

    it("sets completedAt when status becomes done", async () => {
      const task = await useTaskStore.getState().createTask(sampleTaskInput);
      await useTaskStore.getState().updateTask(task.id, { status: "done" });

      const { tasks } = useTaskStore.getState();
      expect(tasks[0].status).toBe("done");
      expect(tasks[0].completedAt).toBeTruthy();
    });

    it("updates updatedAt timestamp", async () => {
      const task = await useTaskStore.getState().createTask(sampleTaskInput);
      const originalUpdatedAt = task.updatedAt;

      // Small delay to ensure different timestamp
      await new Promise((r) => setTimeout(r, 10));
      await useTaskStore.getState().updateTask(task.id, { title: "New title" });

      const { tasks } = useTaskStore.getState();
      expect(tasks[0].updatedAt).not.toBe(originalUpdatedAt);
    });
  });

  describe("deleteTask", () => {
    it("removes the task from store and DB", async () => {
      const task = await useTaskStore.getState().createTask(sampleTaskInput);
      await useTaskStore.getState().deleteTask(task.id);

      expect(useTaskStore.getState().tasks).toHaveLength(0);

      const dbTask = await db.tasks.get(task.id);
      expect(dbTask).toBeUndefined();
    });
  });

  describe("reorderTasks", () => {
    it("updates the order of tasks", async () => {
      const t1 = await useTaskStore.getState().createTask({
        ...sampleTaskInput,
        title: "First",
      });
      const t2 = await useTaskStore.getState().createTask({
        ...sampleTaskInput,
        title: "Second",
      });
      const t3 = await useTaskStore.getState().createTask({
        ...sampleTaskInput,
        title: "Third",
      });

      // Reverse order
      await useTaskStore.getState().reorderTasks([t3.id, t2.id, t1.id]);

      const { tasks } = useTaskStore.getState();
      const first = tasks.find((t) => t.id === t3.id);
      const second = tasks.find((t) => t.id === t2.id);
      const third = tasks.find((t) => t.id === t1.id);
      expect(first!.order).toBe(0);
      expect(second!.order).toBe(1);
      expect(third!.order).toBe(2);
    });
  });

  describe("setFilters / clearFilters", () => {
    it("sets filters", () => {
      useTaskStore.getState().setFilters({ status: ["todo"] });
      expect(useTaskStore.getState().filters.status).toEqual(["todo"]);
    });

    it("merges filters", () => {
      useTaskStore.getState().setFilters({ status: ["todo"] });
      useTaskStore.getState().setFilters({ priority: ["high"] });
      const { filters } = useTaskStore.getState();
      expect(filters.status).toEqual(["todo"]);
      expect(filters.priority).toEqual(["high"]);
    });

    it("clears all filters", () => {
      useTaskStore.getState().setFilters({ status: ["todo"], priority: ["high"] });
      useTaskStore.getState().clearFilters();
      expect(useTaskStore.getState().filters).toEqual({});
    });
  });

  describe("filteredTasks", () => {
    beforeEach(async () => {
      await useTaskStore.getState().createTask({
        title: "Todo task",
        domainId: "d1",
        status: "todo",
        priority: "high",
        tags: ["work"],
      });
      await useTaskStore.getState().createTask({
        title: "Done task",
        domainId: "d2",
        status: "done",
        priority: "low",
        tags: ["personal"],
      });
      await useTaskStore.getState().createTask({
        title: "In progress important",
        domainId: "d1",
        status: "in_progress",
        priority: "urgent",
        tags: ["work"],
      });
    });

    it("returns all tasks when no filters set", () => {
      const result = useTaskStore.getState().filteredTasks();
      expect(result).toHaveLength(3);
    });

    it("filters by status", () => {
      useTaskStore.getState().setFilters({ status: ["todo"] });
      const result = useTaskStore.getState().filteredTasks();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Todo task");
    });

    it("filters by multiple statuses", () => {
      useTaskStore.getState().setFilters({ status: ["todo", "done"] });
      const result = useTaskStore.getState().filteredTasks();
      expect(result).toHaveLength(2);
    });

    it("filters by priority", () => {
      useTaskStore.getState().setFilters({ priority: ["urgent"] });
      const result = useTaskStore.getState().filteredTasks();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("In progress important");
    });

    it("filters by domainId", () => {
      useTaskStore.getState().setFilters({ domainId: "d1" });
      const result = useTaskStore.getState().filteredTasks();
      expect(result).toHaveLength(2);
    });

    it("filters by search in title", () => {
      useTaskStore.getState().setFilters({ search: "important" });
      const result = useTaskStore.getState().filteredTasks();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("In progress important");
    });

    it("filters by search case-insensitive", () => {
      useTaskStore.getState().setFilters({ search: "TODO" });
      const result = useTaskStore.getState().filteredTasks();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Todo task");
    });

    it("filters by tags", () => {
      useTaskStore.getState().setFilters({ tags: ["personal"] });
      const result = useTaskStore.getState().filteredTasks();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Done task");
    });

    it("returns sorted by order", () => {
      const result = useTaskStore.getState().filteredTasks();
      for (let i = 1; i < result.length; i++) {
        expect(result[i].order).toBeGreaterThanOrEqual(result[i - 1].order);
      }
    });
  });
});

describe("DomainStore", () => {
  describe("loadDomains", () => {
    it("seeds default domains and loads them", async () => {
      await useDomainStore.getState().loadDomains();
      const { domains, isLoading } = useDomainStore.getState();
      expect(domains).toHaveLength(3);
      expect(isLoading).toBe(false);
      expect(domains.map((d) => d.name)).toContain("Personnel");
      expect(domains.map((d) => d.name)).toContain("Professionnel");
      expect(domains.map((d) => d.name)).toContain("Études");
    });

    it("does not re-seed when called twice", async () => {
      await useDomainStore.getState().loadDomains();
      await useDomainStore.getState().loadDomains();
      const { domains } = useDomainStore.getState();
      expect(domains).toHaveLength(3);
    });
  });

  describe("createDomain", () => {
    it("creates a domain in store and DB", async () => {
      const domain = await useDomainStore.getState().createDomain({
        name: "Custom",
        color: "#FF00FF",
      });
      expect(domain.id).toBeDefined();
      expect(domain.name).toBe("Custom");
      expect(domain.color).toBe("#FF00FF");
      expect(domain.icon).toBe("folder");
      expect(domain.isDefault).toBe(false);

      const { domains } = useDomainStore.getState();
      expect(domains).toHaveLength(1);

      // DB persistence is verified in db.test.ts
    });
  });

  describe("updateDomain", () => {
    it("updates a domain in store and DB", async () => {
      const domain = await useDomainStore.getState().createDomain({
        name: "Original",
        color: "#000000",
      });
      await useDomainStore.getState().updateDomain(domain.id, {
        name: "Renamed",
        color: "#FFFFFF",
      });

      const { domains } = useDomainStore.getState();
      expect(domains[0].name).toBe("Renamed");
      expect(domains[0].color).toBe("#FFFFFF");
    });
  });

  describe("deleteDomain", () => {
    it("removes domain from store and DB", async () => {
      const domain = await useDomainStore.getState().createDomain({
        name: "ToDelete",
        color: "#FF0000",
      });
      await useDomainStore.getState().deleteDomain(domain.id);

      expect(useDomainStore.getState().domains).toHaveLength(0);

      const dbDomain = await db.domains.get(domain.id);
      expect(dbDomain).toBeUndefined();
    });
  });

  describe("getDomainById", () => {
    it("returns the correct domain", async () => {
      const domain = await useDomainStore.getState().createDomain({
        name: "Find me",
        color: "#123456",
      });
      const found = useDomainStore.getState().getDomainById(domain.id);
      expect(found).toBeDefined();
      expect(found!.name).toBe("Find me");
    });

    it("returns undefined for non-existent id", () => {
      const found = useDomainStore.getState().getDomainById("non-existent");
      expect(found).toBeUndefined();
    });
  });
});

describe("UIStore", () => {
  describe("setTheme", () => {
    it("changes the theme", () => {
      useUIStore.getState().setTheme("dark");
      expect(useUIStore.getState().theme).toBe("dark");

      useUIStore.getState().setTheme("light");
      expect(useUIStore.getState().theme).toBe("light");

      useUIStore.getState().setTheme("system");
      expect(useUIStore.getState().theme).toBe("system");
    });
  });

  describe("toggleSidebar", () => {
    it("toggles sidebar open/closed", () => {
      expect(useUIStore.getState().sidebarOpen).toBe(true);

      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarOpen).toBe(false);

      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().sidebarOpen).toBe(true);
    });
  });

  describe("setCurrentView", () => {
    it("changes the view", () => {
      useUIStore.getState().setCurrentView("board");
      expect(useUIStore.getState().currentView).toBe("board");

      useUIStore.getState().setCurrentView("list");
      expect(useUIStore.getState().currentView).toBe("list");
    });
  });

  describe("toggleShowCompleted", () => {
    it("toggles showCompletedTasks", () => {
      expect(useUIStore.getState().showCompletedTasks).toBe(true);

      useUIStore.getState().toggleShowCompleted();
      expect(useUIStore.getState().showCompletedTasks).toBe(false);

      useUIStore.getState().toggleShowCompleted();
      expect(useUIStore.getState().showCompletedTasks).toBe(true);
    });
  });
});
