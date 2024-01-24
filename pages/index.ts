import * as arrays from "./modules/arrays.js";
import { Link, ScienceDirectLink, YouTubeLink } from "./modules/link.js";

//#region Links
const parseRawLink = (rawLink: unknown) => {
  if (typeof rawLink !== "object") return;
  if (rawLink === null) return;
  if (!("contentId" in rawLink)) return;
  if (!("type" in rawLink)) return;

  const { contentId, type } = rawLink;
  if (typeof contentId !== "string" || typeof type !== "string") return;

  switch (type) {
    case "sciencedirect": {
      return new ScienceDirectLink(contentId);
    }
    case "youtube": {
      return new YouTubeLink(contentId);
    }
  }
};

const linksJson = async () => {
  const response = await fetch("assets/links.json");
  const json: unknown = await response.json();

  const links: Link[] = [];
  if (!Array.isArray(json)) return links;

  for (const rawLink of json) {
    const link = parseRawLink(rawLink);
    if (link) links.push(link);
  }

  return links;
};

const linksArray = await linksJson();
const linksMap = arrays.associateBy(linksArray, ({ id }) => id);
//#endregion

const contentRandomizer =
  // prettier-ignore
  document.querySelector<HTMLAnchorElement>("#content-randomizer");
const contentContainer = document.querySelector("#content-container");

const locationLink = () => {
  // @ts-expect-error URL constructor does accept location
  const { searchParams } = new URL(location);
  const linkId = searchParams.get("link") ?? "";
  return linksMap.get(linkId);
};

const randomLink = () => arrays.random(linksArray);

const replaceContent = (link: Link) => {
  if (!contentRandomizer || !contentContainer) return;

  const content = link.content();
  contentContainer.replaceChildren(content);

  // @ts-expect-error URL constructor does accept location
  const url = new URL(location);
  const { searchParams } = url;
  searchParams.set("link", link.id);
  history.replaceState({}, "", url);

  const hrefLink = randomLink();
  if (hrefLink) {
    searchParams.set("link", hrefLink.id);
    contentRandomizer.href = url.toString();
  }
};

//#region main
contentRandomizer?.addEventListener("click", (event) => {
  event.preventDefault();

  // Set location to the clicked link
  history.replaceState({}, "", contentRandomizer.href);

  const clickedLink = locationLink();
  if (clickedLink) replaceContent(clickedLink);
});

const initialLink = locationLink() ?? randomLink();
if (initialLink) replaceContent(initialLink);
//#endregion
