import * as arrays from "../arrays.ts";
import linksJson from "./links.json";

//#region Constants
export enum LinkType {
  Basic = "basic",
  Pdf = "pdf",
  YouTube = "youtube",
}
//#endregion

//#region Types
export type BaseLink = {
  id: string;
  type: LinkType;
};

export type Link = BaseLink & {
  author: string;
  title: string;
};
//#endregion

export const all = linksJson as Link[];

export const random = () => arrays.random(all);

export const location = () => {
  const { location } = window;
  const { href } = location;
  const { searchParams } = new URL(href);

  const type = searchParams.get("type");
  switch (type) {
    case LinkType.Basic:
    case LinkType.Pdf:
    case LinkType.YouTube: {
      const id = searchParams.get("id");
      return id ? { id, type } : undefined;
    }
  }
};

export const url = ({ id, type }: BaseLink) => {
  const { location } = window;
  const { href } = location;
  const url = new URL(href);

  const { searchParams } = url;
  searchParams.set("id", id);
  searchParams.set("type", type);

  return url;
};

//#region createElement
const createBasicElement = ({ id }: BaseLink) => {
  const iframe = document.createElement("iframe");
  iframe.src = id;
  iframe.title = "Embedded website browser";
  return iframe;
};

const createPdfElement = ({ id }: BaseLink) => {
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
            url: `/assets/pdf/${id}.pdf`,
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

const createYouTubeElement = ({ id }: BaseLink) => {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}`;
  iframe.title = "YouTube video player";
  // element.frameBorder = "0";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  return iframe;
};

export const createElement = (link: BaseLink) => {
  switch (link.type) {
    case LinkType.Basic: {
      return createBasicElement(link);
    }
    case LinkType.Pdf: {
      return createPdfElement(link);
    }
    case LinkType.YouTube: {
      return createYouTubeElement(link);
    }
  }
};
//#endregion
