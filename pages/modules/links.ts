import * as arrays from "./arrays.js";

//#region Classes
class BaseLink<K extends keyof HTMLElementTagNameMap> {
  private readonly tagName;
  protected readonly contentId;
  readonly id;

  constructor(tagName: K, { name }: Record<"name", string>, contentId: string) {
    this.tagName = tagName;
    this.contentId = contentId;
    this.id = `${name}-${this.contentId}`;
  }

  content() {
    const content = document.createElement(this.tagName);
    content.id = "content";
    return content;
  }

  toString() {
    return this.id;
  }
}

class PdfLink extends BaseLink<"object"> {
  constructor(contentId: string) {
    super("object", PdfLink, contentId);
  }

  content() {
    const content = super.content();
    content.data = `assets/pdf/${this.contentId}.pdf`;
    content.type = "application/pdf";
    return content;
  }
}

class YouTubeLink extends BaseLink<"iframe"> {
  constructor(contentId: string) {
    super("iframe", YouTubeLink, contentId);
  }

  content() {
    const content = super.content();
    content.src = `https://www.youtube-nocookie.com/embed/${this.contentId}`;
    content.title = "YouTube video player";
    // element.frameBorder = "0";
    content.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    content.allowFullscreen = true;
    return content;
  }
}
//#endregion

//#region Types
type Link = PdfLink | YouTubeLink;
export default Link;
//#endregion

const parse = (rawLink: unknown) => {
  if (typeof rawLink !== "object") return;
  if (rawLink === null) return;
  if (!("contentId" in rawLink)) return;
  if (!("type" in rawLink)) return;

  const { contentId, type } = rawLink;
  if (typeof contentId !== "string" || typeof type !== "string") return;

  switch (type) {
    case "pdf": {
      return new PdfLink(contentId);
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
    const link = parse(rawLink);
    if (link) links.push(link);
  }

  return links;
};

const linksArray = await linksJson();
const linksMap = arrays.associateBy(linksArray, ({ id }) => id);

export const get = (id: string) => linksMap.get(id);

export const random = () => arrays.random(linksArray);
