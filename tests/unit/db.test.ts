import { describe, it, expect, beforeEach } from "vitest";
import { db, seedDefaultDomains } from "@/lib/db/local";

beforeEach(async () => {
  await db.tasks.clear();
  await db.domains.clear();
});

describe("DB initialization", () => {
  it("db instance is defined", () => {
    expect(db).toBeDefined();
  });

  it("has tasks table", () => {
    expect(db.tasks).toBeDefined();
  });

  it("has domains table", () => {
    expect(db.domains).toBeDefined();
  });
});

describe("seedDefaultDomains", () => {
  it("creates 3 default domains", async () => {
    await seedDefaultDomains();
    const domains = await db.domains.toArray();
    expect(domains).toHaveLength(3);
  });

  it("does not duplicate when called twice", async () => {
    await seedDefaultDomains();
    await seedDefaultDomains();
    const domains = await db.domains.toArray();
    expect(domains).toHaveLength(3);
  });

  it("creates Personnel, Professionnel, Etudes", async () => {
    await seedDefaultDomains();
    const domains = await db.domains.orderBy("order").toArray();
    expect(domains[0].name).toBe("Personnel");
    expect(domains[1].name).toBe("Professionnel");
    expect(domains[2].name).toBe("Études");
  });

  it("each domain has correct fields", async () => {
    await seedDefaultDomains();
    const domains = await db.domains.toArray();
    for (const d of domains) {
      expect(d.id).toBeDefined();
      expect(d.name).toBeTruthy();
      expect(d.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(d.icon).toBeTruthy();
      expect(d.isDefault).toBe(true);
      expect(d.createdAt).toBeTruthy();
      expect(d.updatedAt).toBeTruthy();
    }
  });
});

describe("Tasks CRUD", () => {
  const makeTask = (overrides: Partial<Parameters<typeof db.tasks.add>[0]> = {}) => ({
    id: crypto.randomUUID(),
    title: "Test task",
    description: "A test task",
    status: "todo" as const,
    priority: "medium" as const,
    domainId: "domain-1",
    tags: [],
    dueDate: null,
    estimatedMinutes: null,
    actualMinutes: null,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    ...overrides,
  });

  it("creates a task and returns an id", async () => {
    const id = await db.tasks.add(makeTask());
    expect(id).toBeDefined();
  });

  it("reads a task by id", async () => {
    const id = await db.tasks.add(makeTask({ title: "Read me" }));
    const task = await db.tasks.get(id);
    expect(task).toBeDefined();
    expect(task!.title).toBe("Read me");
  });

  it("updates a task title", async () => {
    const id = await db.tasks.add(makeTask());
    await db.tasks.update(id, { title: "Updated title" });
    const task = await db.tasks.get(id);
    expect(task!.title).toBe("Updated title");
  });

  it("updates a task status", async () => {
    const id = await db.tasks.add(makeTask());
    await db.tasks.update(id, { status: "done" });
    const task = await db.tasks.get(id);
    expect(task!.status).toBe("done");
  });

  it("deletes a task", async () => {
    const id = await db.tasks.add(makeTask());
    await db.tasks.delete(id);
    const task = await db.tasks.get(id);
    expect(task).toBeUndefined();
  });

  it("lists all tasks", async () => {
    await db.tasks.add(makeTask({ title: "Task 1" }));
    await db.tasks.add(makeTask({ title: "Task 2" }));
    await db.tasks.add(makeTask({ title: "Task 3" }));
    const tasks = await db.tasks.toArray();
    expect(tasks).toHaveLength(3);
  });

  it("filters tasks by status", async () => {
    await db.tasks.add(makeTask({ status: "todo" }));
    await db.tasks.add(makeTask({ status: "in_progress" }));
    await db.tasks.add(makeTask({ status: "done" }));
    const todos = await db.tasks.where("status").equals("todo").toArray();
    expect(todos).toHaveLength(1);
    expect(todos[0].status).toBe("todo");
  });

  it("filters tasks by domainId", async () => {
    await db.tasks.add(makeTask({ domainId: "d1" }));
    await db.tasks.add(makeTask({ domainId: "d2" }));
    await db.tasks.add(makeTask({ domainId: "d1" }));
    const d1Tasks = await db.tasks.where("domainId").equals("d1").toArray();
    expect(d1Tasks).toHaveLength(2);
  });

  it("orders tasks by order field", async () => {
    await db.tasks.add(makeTask({ title: "C", order: 2 }));
    await db.tasks.add(makeTask({ title: "A", order: 0 }));
    await db.tasks.add(makeTask({ title: "B", order: 1 }));
    const ordered = await db.tasks.orderBy("order").toArray();
    expect(ordered.map((t) => t.title)).toEqual(["A", "B", "C"]);
  });
});

describe("Domains CRUD", () => {
  const makeDomain = (overrides: Partial<Parameters<typeof db.domains.add>[0]> = {}) => ({
    id: crypto.randomUUID(),
    name: "Test domain",
    color: "#FF0000",
    icon: "folder",
    description: "A test domain",
    isDefault: false,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  it("creates a domain", async () => {
    const id = await db.domains.add(makeDomain());
    expect(id).toBeDefined();
  });

  it("reads a domain by id", async () => {
    const id = await db.domains.add(makeDomain({ name: "My Domain" }));
    const domain = await db.domains.get(id);
    expect(domain).toBeDefined();
    expect(domain!.name).toBe("My Domain");
  });

  it("updates a domain name", async () => {
    const id = await db.domains.add(makeDomain());
    await db.domains.update(id, { name: "New Name" });
    const domain = await db.domains.get(id);
    expect(domain!.name).toBe("New Name");
  });

  it("updates a domain color", async () => {
    const id = await db.domains.add(makeDomain());
    await db.domains.update(id, { color: "#00FF00" });
    const domain = await db.domains.get(id);
    expect(domain!.color).toBe("#00FF00");
  });

  it("deletes a domain", async () => {
    const id = await db.domains.add(makeDomain());
    await db.domains.delete(id);
    const domain = await db.domains.get(id);
    expect(domain).toBeUndefined();
  });

  it("lists all domains ordered by order", async () => {
    await db.domains.add(makeDomain({ name: "C", order: 2 }));
    await db.domains.add(makeDomain({ name: "A", order: 0 }));
    await db.domains.add(makeDomain({ name: "B", order: 1 }));
    const ordered = await db.domains.orderBy("order").toArray();
    expect(ordered.map((d) => d.name)).toEqual(["A", "B", "C"]);
  });
});
