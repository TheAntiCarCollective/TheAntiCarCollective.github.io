class BaseLink<K extends keyof HTMLElementTagNameMap> {
  private readonly tagName;
  protected readonly contentId;
  readonly id;

  protected constructor(
    tagName: K,
    { name }: Record<"name", string>,
    contentId: string,
  ) {
    this.tagName = tagName;
    this.contentId = contentId;

    this.id = `${name}-${this.contentId}`;
  }

  protected content() {
    const content = document.createElement(this.tagName);
    content.id = "content";
    return content;
  }

  toString() {
    return this.id;
  }
}

export class ScienceDirectLink extends BaseLink<"iframe"> {
  constructor(contentId: string) {
    super("iframe", ScienceDirectLink, contentId);
  }

  content() {
    const content = super.content();
    content.src = `https://www.sciencedirect.com/science/article/pii/${this.contentId}`;
    return content;
  }
}

export class YouTubeLink extends BaseLink<"iframe"> {
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

export type Link = ScienceDirectLink | YouTubeLink;
