import { test, expect } from "@playwright/test";
import { updateApplicationStatus } from "@/lib/db/applications";

type Row = Record<string, unknown>;

function makeDb(opts: {
  updateResult: { data: Row | null; error: unknown };
  jobTitle?: string;
}) {
  const insertedNotifications: Row[] = [];

  const db = {
    from(table: string) {
      if (table === "applications") {
        return {
          update: () => ({
            eq: () => ({
              eq: () => ({
                select: () => ({
                  maybeSingle: async () => opts.updateResult,
                }),
              }),
            }),
          }),
        };
      }
      if (table === "job_posts") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: { title: opts.jobTitle ?? "Engineer" } }),
            }),
          }),
        };
      }
      if (table === "notifications") {
        return {
          insert: (row: Row) => {
            insertedNotifications.push(row);
            return Promise.resolve({ data: null, error: null });
          },
        };
      }
      throw new Error(`unexpected table: ${table}`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return { db, insertedNotifications };
}

test.describe("updateApplicationStatus", () => {
  test("inserts a notification for a mapped status (interview)", async () => {
    const { db, insertedNotifications } = makeDb({
      updateResult: { data: { applicant_id: "applicant-1" }, error: null },
      jobTitle: "Platform Engineer",
    });

    await updateApplicationStatus(db, "app-1", "interview", "job-1");

    expect(insertedNotifications).toHaveLength(1);
    expect(insertedNotifications[0]).toMatchObject({
      user_id: "applicant-1",
      kind: "application",
      title: "You've been selected for an interview for Platform Engineer",
    });
  });

  test("does not insert a notification for an unmapped status (submitted)", async () => {
    const { db, insertedNotifications } = makeDb({
      updateResult: { data: { applicant_id: "applicant-1" }, error: null },
    });

    await updateApplicationStatus(db, "app-1", "submitted", "job-1");

    expect(insertedNotifications).toHaveLength(0);
  });

  test("does not insert a notification when the update errors", async () => {
    const { db, insertedNotifications } = makeDb({
      updateResult: { data: null, error: { message: "update failed" } },
    });

    await updateApplicationStatus(db, "app-1", "interview", "job-1");

    expect(insertedNotifications).toHaveLength(0);
  });
});
