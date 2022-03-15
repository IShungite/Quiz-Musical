export type Playlist = {
  collaborative: boolean;
  description: string;
  href: string;
  id: string;
  images: PlaylistImage[];
  name: string;
  type: string;
  uri: string;
  owner: unknown;
  tracks: unknown;
  external_urls: unknown;
};

type PlaylistImage = {
  height: null | number;
  width: null | number;
  url: string;
};
