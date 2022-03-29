import { Image } from "./Tracks";

export type Playlist = {
  collaborative: boolean;
  description: string;
  href: string;
  id: string;
  images: Image[];
  name: string;
  type: string;
  uri: string;
  owner: Owner;
  tracks: PlaylistTracks;
  external_urls: unknown;
};

type PlaylistTracks = {
  href: string;
  total: number;
};

type Owner = {
  display_name: string;
  external_url: unknown;
  href: string;
  primary_color: unknown;
  public: unknown;
  snapshot_id: string;
};
