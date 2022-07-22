export class Token<MediaType extends string = string> {
  path: string[];
  value: string | number;
  mediaType: MediaType | null;

  constructor(path: string[], value: string | number, mediaType?: MediaType) {
    this.path = path;
    this.value = value;
    this.mediaType = mediaType ?? null;
  }

  get var() {
    return `--${this.path.join("-")}`;
  }
}
