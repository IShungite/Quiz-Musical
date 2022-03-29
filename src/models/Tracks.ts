export type Tracks = {
  href: string;
  items: Track[];
};

export type Track = {
  added_at: Date;
  added_by: unknown;
  is_local: boolean;
  primary_color: unknown;
  track: TrackInfo;
};

type TrackInfo = {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
};

type ExternalIds = {
  isrc: string;
};

type Album = {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
};

type Artist = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

type ExternalUrls = {
  spotify: string;
};

export type Image = {
  height: null | number;
  width: null | number;
  url: string;
};
