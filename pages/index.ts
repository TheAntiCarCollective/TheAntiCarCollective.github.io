import Link, * as links from "./modules/links.js";

const contentRandomizer =
  // prettier-ignore
  document.querySelector<HTMLAnchorElement>("#content-randomizer");
const contentContainer = document.querySelector("#content-container");

const locationLink = () => {
  // @ts-expect-error URL constructor does accept location
  const { searchParams } = new URL(location);
  const linkId = searchParams.get("link") ?? "";
  return links.get(linkId);
};

const randomLink = links.random;

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
