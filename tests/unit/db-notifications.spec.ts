import { test, expect } from "@playwright/test";
import { notifyAllAdmins, countUnreadNotifications } from "@/lib/db/notifications";

test.describe("notifyAllAdmins", () => {
  test("does nothing when there are no admins", async () => {
    let insertCalled = false;
    const db = {
      from: (table: string) => {
        if (table === "profiles") {
          return { select: () => ({ eq: async () => ({ data: [] }) }) };
        }
        if (table === "notifications") {
          return { insert: () => { insertCalled = true; return Promise.resolve({ data: null, error: null }); } };
        }
        throw new Error(`unexpected table: ${table}`);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const result = await notifyAllAdmins(db, "info", "Title", "Body");

    expect(result).toBeUndefined();
    expect(insertCalled).toBe(false);
  });

  test("fans out a notification row per admin", async () => {
    let insertedRows: unknown[] = [];
    const db = {
      from: (table: string) => {
        if (table === "profiles") {
          return {
            select: () => ({ eq: async () => ({ data: [{ id: "admin-a" }, { id: "admin-b" }] }) }),
          };
        }
        if (table === "notifications") {
          return {
            insert: (rows: unknown[]) => {
              insertedRows = rows;
              return Promise.resolve({ data: null, error: null });
            },
          };
        }
        throw new Error(`unexpected table: ${table}`);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    await notifyAllAdmins(db, "info", "New listing", "Check it out");

    expect(insertedRows).toEqual([
      { user_id: "admin-a", kind: "info", title: "New listing", body: "Check it out" },
      { user_id: "admin-b", kind: "info", title: "New listing", body: "Check it out" },
    ]);
  });
});

test.describe("countUnreadNotifications", () => {
  test("falls back to 0 when count is null", async () => {
    const db = {
      from: () => ({
        select: () => ({ eq: () => ({ eq: async () => ({ count: null }) }) }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    expect(await countUnreadNotifications(db, "user-1")).toBe(0);
  });

  test("returns the count when present", async () => {
    const db = {
      from: () => ({
        select: () => ({ eq: () => ({ eq: async () => ({ count: 3 }) }) }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    expect(await countUnreadNotifications(db, "user-1")).toBe(3);
  });
});
