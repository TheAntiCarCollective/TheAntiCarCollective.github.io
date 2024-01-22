import * as arrays from "./modules/arrays.js";
import { YouTubeLink } from "./modules/link.js";

//#region Links
const linksArray = [
  new YouTubeLink("Ra_0DgnJ1uQ"),
  new YouTubeLink("bnKIVX968PQ"),
  new YouTubeLink("VVUeqxXwCA0"),
  new YouTubeLink("7IsMeKl-Sv0"),
  new YouTubeLink("XfQUOHlAocY"),
  new YouTubeLink("ORzNZUeUHAM"),
  new YouTubeLink("CTV-wwszGw8"),
  new YouTubeLink("uxykI30fS54"),
  new YouTubeLink("bglWCuCMSWc"),
  new YouTubeLink("vxWjtpzCIfA"),
  new YouTubeLink("d8RRE2rDw4k"),
  new YouTubeLink("cO6txCZpbsQ"),
  new YouTubeLink("7Nw6qyyrTeI"),
  new YouTubeLink("KPUlgSRn6e0"),
  new YouTubeLink("_ByEBjf9ktY"),
  new YouTubeLink("mXLqrMljdfU"),
  new YouTubeLink("n94-_yE4IeU"),
  new YouTubeLink("jN7mSXMruEo"),
  new YouTubeLink("kdz6FeQLuHQ"),
  new YouTubeLink("REni8Oi1QJQ"),
  new YouTubeLink("AOc8ASeHYNw"),
  new YouTubeLink("ztpcWUqVpIg"),
  new YouTubeLink("6Vil5KC7Bl0"),
];

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

const randomizeLink = () => {
  const link = arrays.random(linksArray);
  if (!link) return;
  if (!contentRandomizer) return link;

  // @ts-expect-error URL constructor does accept location
  const url = new URL(location);
  const { searchParams } = url;
  searchParams.set("link", link.id);
  contentRandomizer.href = url.toString();
  return link;
};

const replaceContent = () => {
  const link = locationLink() ?? randomizeLink();
  if (!link) return;

  const content = link.content();
  contentContainer?.replaceChildren(content);
  randomizeLink();
};

//#region main
contentRandomizer?.addEventListener("click", (event) => {
  event.preventDefault();
  // Changes location (which replaceContent uses)
  history.pushState({}, "", contentRandomizer.href);
  replaceContent();
});

replaceContent();
//#endregion
