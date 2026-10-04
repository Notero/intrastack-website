import { test, expect } from "@playwright/test";
import { SITE, absoluteUrl } from "@/lib/seo/site";
import {
  breadcrumbSchema,
  serviceSchema,
  personSchema,
} from "@/lib/seo/schemas";

test.describe("absoluteUrl", () => {
  test("joins the site URL and a leading-slash path", () => {
    expect(absoluteUrl("/about")).toBe(`${SITE.url}/about`);
  });

  test("adds a leading slash when missing", () => {
    expect(absoluteUrl("about")).toBe(`${SITE.url}/about`);
  });

  test("defaults to the root path", () => {
    expect(absoluteUrl()).toBe(`${SITE.url}/`);
  });
});

test.describe("breadcrumbSchema", () => {
  test("builds ordered ListItems and resolves relative URLs", () => {
    const schema = breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
    ]);

    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]).toMatchObject({
      position: 1,
      name: "Home",
      item: `${SITE.url}/`,
    });
    expect(schema.itemListElement[1]).toMatchObject({
      position: 2,
      name: "Services",
      item: `${SITE.url}/services`,
    });
  });

  test("leaves already-absolute URLs untouched", () => {
    const schema = breadcrumbSchema([
      { name: "External", url: "https://other.example/page" },
    ]);
    expect(schema.itemListElement[0].item).toBe("https://other.example/page");
  });
});

test.describe("serviceSchema", () => {
  test("resolves a relative image path against the site URL", () => {
    const schema = serviceSchema({
      name: "Cloud Migration",
      path: "/services/cloud-migration",
      description: "Move workloads to the cloud.",
      image: "/images/cloud.jpg",
    });
    expect(schema.image).toBe(`${SITE.url}/images/cloud.jpg`);
    expect(schema.url).toBe(`${SITE.url}/services/cloud-migration`);
  });

  test("leaves an already-absolute image URL untouched", () => {
    const schema = serviceSchema({
      name: "Cloud Migration",
      path: "/services/cloud-migration",
      description: "Move workloads to the cloud.",
      image: "https://cdn.example.com/cloud.jpg",
    });
    expect(schema.image).toBe("https://cdn.example.com/cloud.jpg");
  });

  test("defaults areaServed to Worldwide", () => {
    const schema = serviceSchema({
      name: "Cloud Migration",
      path: "/services/cloud-migration",
      description: "Move workloads to the cloud.",
    });
    expect(schema.areaServed).toBe("Worldwide");
    expect(schema.image).toBeUndefined();
  });
});

test.describe("personSchema", () => {
  test("omits sameAs when the list is empty", () => {
    const schema = personSchema({
      name: "Jane Doe",
      jobTitle: "CEO",
      sameAs: [],
    });
    expect(schema.sameAs).toBeUndefined();
  });

  test("keeps sameAs when populated", () => {
    const schema = personSchema({
      name: "Jane Doe",
      jobTitle: "CEO",
      sameAs: ["https://linkedin.com/in/janedoe"],
    });
    expect(schema.sameAs).toEqual(["https://linkedin.com/in/janedoe"]);
  });
});
