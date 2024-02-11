import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, test } from "vitest";
import { z } from "zod";

import * as links from "./links.ts";
import { LinkType } from "./links.ts";

const LinksSchema = z.array(
  z.object({
    author: z.string(),
    id: z.string(),
    title: z.string(),
    type: z.nativeEnum(LinkType),
  }),
);

const { all } = links;

test("all is LinksSchema", () => {
  const typed: z.infer<typeof LinksSchema> = all;
  const parsed = LinksSchema.parse(all);
  expect(parsed).toStrictEqual(typed);
});

describe.each(all)("%j", (link) => {
  test("is not a duplicate", () => {
    const linkIndex = all.indexOf(link);
    for (const [anyLinkIndex, anyLink] of all.entries()) {
      if (anyLinkIndex !== linkIndex) {
        if (anyLink.type === link.type)
          // If equal types, no equal IDs
          expect(anyLink.id).not.toBe(link.id);

        if (anyLink.author === link.author)
          // If equal authors, no equal titles
          expect(anyLink.title).not.toBe(link.title);
      }
    }
  });

  test("if url then location returns equal BaseLink", () => {
    const url = links.url(link);
    history.pushState({}, "", url);

    const locationLink = links.location();
    expect(locationLink?.type).toBe(link.type);
    expect(locationLink?.id).toBe(link.id);
  });

  if (link.type === LinkType.Pdf) {
    test("id is valid", () => {
      const id = `${link.author} ${link.title}`
        .replace(/\s/g, "-")
        .toLowerCase();

      expect(id).toBe(link.id);
    });

    test("file exists", () => {
      const filePath = path.join("public", "assets", "pdf", `${link.id}.pdf`);
      const exists = fs.existsSync(filePath);
      expect(exists).toBeTruthy();
    });
  }
});