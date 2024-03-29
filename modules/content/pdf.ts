import type { BaseLink } from "./links.ts";

let adobe = false;
if (window.AdobeDC) adobe = true;
else document.addEventListener("adobe_dc_view_sdk.ready", () => (adobe = true));

const fileName = ({ id }: BaseLink) => `${id}.pdf`;

const url = (link: BaseLink) =>
  // root is defined as public folder
  `/static/pdf/${fileName(link)}`;

const createAdobeElement = (link: BaseLink) => {
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
            url: url(link),
          },
        },
        metaData: {
          fileName: fileName(link),
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

const createEmbedElement = (link: BaseLink) => {
  const embed = document.createElement("embed");
  embed.src = url(link);
  embed.type = "application/pdf";
  return embed;
};

export const createElement = (link: BaseLink) =>
  adobe ? createAdobeElement(link) : createEmbedElement(link);
