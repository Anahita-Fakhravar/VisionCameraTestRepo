export interface Asset {
  base64?: string;
  uri?: string;
  width?: number;
  height?: number;
  originalPath?: string;
  fileSize?: number;
  type?: string;
  fileName?: string;
  duration?: number;
  bitrate?: number;
  timestamp?: string;
  id?: string;
  isMirrored?: boolean;
}

export interface PictureAsset extends Asset {
  path: string;
  isMirrored?: boolean;
}
