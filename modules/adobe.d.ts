export type MetaDataConfig = {
  fileName: string;
  hasReadOnlyAccess?: boolean;
};

export type LocationConfig = {
  url: string;
};

export type ContentConfig = {
  location: LocationConfig;
};

export type FileInfo = {
  content: ContentConfig;
  metaData: MetaDataConfig;
};

export type ViewConfig = {
  clientId: string;
  divId: string;
};

export type PreviewConfig = {
  showAnnotationTools?: boolean;
};

export type View = {
  previewFile(fileInfo: FileInfo, previewConfig?: PreviewConfig);
};

export type AdobeDC = {
  View: new (config: ViewConfig) => View;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    AdobeDC: AdobeDC | undefined;
  }
}
