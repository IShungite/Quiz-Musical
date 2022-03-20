export type Playlist = {
  collaborative: boolean;
  description: string;
  href: string;
  id: string;
  images: PlaylistImage[];
  name: string;
  type: string;
  uri: string;
  owner: Owner;
  tracks: unknown;
  external_urls: unknown;
};

type PlaylistImage = {
  height: null | number;
  width: null | number;
  url: string;
};

type Owner = {
  display_name: string;
  external_url: unknown;
  href: string;
  primary_color: unknown;
  public: unknown;
  snapshot_id: string;
};
