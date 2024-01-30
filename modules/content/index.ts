import type Link from "./links.ts";

import * as links from "./links.ts";

const contentContainer = () => document.querySelector("#content-container");

const contentRandomizer = () =>
  document.querySelector<HTMLAnchorElement>("#content-randomizer");

const render = (link: Link) => {
  const url = links.url(link);
  history.pushState({}, "", url);

  const element = links.createElement(link);
  const container = contentContainer();
  if (element && container) {
    element.id = "content";
    container.replaceChildren(element);
  }

  const hrefLink = links.random();
  const randomizer = contentRandomizer();
  if (hrefLink && randomizer) {
    const { href } = links.url(hrefLink);
    randomizer.href = href;
  }
};

//#region initialize
const initialize = () => {
  const randomizer = contentRandomizer();
  randomizer?.addEventListener("click", (event) => {
    event.preventDefault();

    // Set location to the clicked link
    history.pushState({}, "", randomizer.href);

    const clickedLink = links.location();
    if (clickedLink) render(clickedLink);
  });

  const initialLink = links.location() ?? links.random();
  if (initialLink) render(initialLink);
};

if (window.AdobeDC) initialize();
else document.addEventListener("adobe_dc_view_sdk.ready", initialize);
//#endregion
