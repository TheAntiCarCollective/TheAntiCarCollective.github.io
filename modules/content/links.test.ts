import * as fs from "node:fs";
import * as path from "node:path";
import { expect, test } from "vitest";

import * as links from "./links.ts";

const { all } = links;
const allPdf = all.filter(({ type }) => type === "pdf");

test.each(all)("%j is a valid type", (link) => {
  const element = links.createElement(link);
  expect(element).toBeDefined();
});

test.each(all)("%j as URL is equal to location", (link) => {
  const url = links.url(link);
  history.pushState({}, "", url);
  const locationLink = links.location();
  expect(locationLink).toStrictEqual(link);
});

test.each(allPdf)("$id PDF file exists", ({ id }) => {
  const filePath = path.join("public", "pdf", `${id}.pdf`);
  const exists = fs.existsSync(filePath);
  expect(exists).toBeTruthy();
});
