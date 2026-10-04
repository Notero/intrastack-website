import { test, expect } from "@playwright/test";
import { deleteJobPost } from "@/lib/db/jobPosts";

function makeDb() {
  const eqCalls: [string, unknown][] = [];

  const chain = {
    eq(col: string, val: unknown) {
      eqCalls.push([col, val]);
      return chain;
    },
  };

  const db = {
    from: () => ({
      delete: () => chain,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return { db, eqCalls };
}

test.describe("deleteJobPost", () => {
  test("filters by id only when no match is given", () => {
    const { db, eqCalls } = makeDb();
    deleteJobPost(db, "job-1");
    expect(eqCalls).toEqual([["id", "job-1"]]);
  });

  test("adds a recruiter_id filter when match.recruiterId is set", () => {
    const { db, eqCalls } = makeDb();
    deleteJobPost(db, "job-1", { recruiterId: "user-1" });
    expect(eqCalls).toEqual([
      ["id", "job-1"],
      ["recruiter_id", "user-1"],
    ]);
  });

  test("adds a published filter when match.published is set", () => {
    const { db, eqCalls } = makeDb();
    deleteJobPost(db, "job-1", { published: false });
    expect(eqCalls).toEqual([
      ["id", "job-1"],
      ["published", false],
    ]);
  });

  test("adds both filters when both match fields are set", () => {
    const { db, eqCalls } = makeDb();
    deleteJobPost(db, "job-1", { recruiterId: "user-1", published: false });
    expect(eqCalls).toEqual([
      ["id", "job-1"],
      ["recruiter_id", "user-1"],
      ["published", false],
    ]);
  });
});
