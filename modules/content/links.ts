import * as arrays from "../arrays.ts";
import links from "./links.json";

//#region Types
type Link = (typeof links)[number];
export default Link;
//#endregion

export { default as all } from "./links.json";

export const random = () => arrays.random(links);

export const location = () => {
  const { location } = window;
  const { href } = location;
  const url = new URL(href);

  const { searchParams } = url;
  const id = searchParams.get("id") ?? "";
  const type = searchParams.get("type") ?? "";

  return id && type ? { id, type } : undefined;
};

export const url = ({ id, type }: Link) => {
  const { location } = window;
  const { href } = location;
  const url = new URL(href);

  const { searchParams } = url;
  searchParams.set("id", id);
  searchParams.set("type", type);

  return url;
};

//#region createElement
const createBasicElement = ({ id }: Link) => {
  const iframe = document.createElement("iframe");
  iframe.src = id;
  iframe.title = "Embedded website browser";
  return iframe;
};

const createPdfElement = ({ id }: Link) => {
  const div = document.createElement("div");

  const observer = new MutationObserver((_mutations, observer) => {
    if (document.contains(div)) observer.disconnect();
    else return;

    const { AdobeDC } = window;
    if (!AdobeDC) return;

    const view = new AdobeDC.View({
      clientId: "7f60fd21707b4ca99426ce80b460246c",
      divId: div.id,
    });

    view.previewFile(
      {
        content: {
          location: {
            // root is defined as public folder
            url: `/pdf/${id}.pdf`,
          },
        },
        metaData: {
          fileName: `${id}.pdf`,
          hasReadOnlyAccess: true,
        },
      },
      {
        showAnnotationTools: false,
      },
    );
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });

  return div;
};

const createYouTubeElement = ({ id }: Link) => {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}`;
  iframe.title = "YouTube video player";
  // element.frameBorder = "0";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  return iframe;
};

export const createElement = (link: Link) => {
  switch (link.type) {
    case "basic": {
      return createBasicElement(link);
    }
    case "pdf": {
      return createPdfElement(link);
    }
    case "youtube": {
      return createYouTubeElement(link);
    }
  }
};
//#endregion
