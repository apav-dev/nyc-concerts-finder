export type SpotifyTrack = {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: {
      reason: string;
    };
    type: string;
    uri: string;
    copyrights: {
      text: string;
      type: string;
    }[];
    external_ids: {
      isrc: string;
      ean: string;
      upc: string;
    };
    genres: string[];
    label: string;
    popularity: number;
    album_group: string;
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
  };
  artists: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string;
      total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
  }[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  restrictions: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
  waveform?: number[];
};

// mock data of SpotifyTrack
export const mockSpotifyTrack: SpotifyTrack = {
  album: {
    album_type: "album",
    total_tracks: 12,
    available_markets: [
      "AD",
      "AE",
      "AR",
      "AT",
      "AU",
      "BE",
      "BG",
      "BH",
      "BO",
      "BR",
      "CA",
      "CH",
      "CL",
      "CO",
      "CR",
      "CY",
      "CZ",
      "DE",
      "DK",
      "DO",
      "DZ",
      "EC",
      "EE",
      "EG",
      "ES",
      "FI",
      "FR",
      "GB",
      "GR",
      "GT",
      "HK",
      "HN",
      "HU",
      "ID",
      "IE",
      "IL",
      "IN",
      "IS",
      "IT",
      "JO",
      "JP",
      "KW",
      "LB",
      "LI",
      "LT",
      "LU",
      "LV",
      "MA",
      "MC",
      "MT",
      "MX",
      "MY",
      "NI",
      "NL",
      "NO",
      "NZ",
      "OM",
      "PA",
      "PE",
      "PH",
      "PL",
      "PS",
      "PT",
      "PY",
      "QA",
      "RO",
      "SA",
      "SE",
      "SG",
      "SI",
      "SK",
      "SV",
      "TH",
      "TN",
      "TR",
      "TW",
      "US",
      "UY",
      "VN",
      "ZA",
    ],
    external_urls: {
      spotify: "https://open.spotify.com/album/6vV5UrXcfyQD1wu4Qo2I9F",
    },
    href: "https://api.spotify.com/v1/albums/6vV5UrXcfyQD1wu4Qo2I9F",
    id: "6vV5UrXcfyQD1wu4Qo2I9F",
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b273b3b2b2b2b2b2b2b2b2b2b2b2",
        height: 640,
        width: 640,
      },
      {
        url: "https://i.scdn.co/image/ab67616d00001e02b3b2b2b2b2b2b2b2b2b2b2b2",
        height: 300,
        width: 300,
      },
      {
        url: "https://i.scdn.co/image/ab67616d00001e02ccdddd46119a4ff53eaf1f5d",
        height: 64,
        width: 64,
      },
    ],
    name: "The Best Of The Doors",
    release_date: "2000-01-01",
    release_date_precision: "day",
    restrictions: {
      reason: "market",
    },
    type: "album",
    uri: "spotify:album:6vV5UrXcfyQD1wu4Qo2I9F",
    copyrights: [
      {
        text: "© 2000 Elektra Entertainment Group Inc.",
        type: "C",
      },
      {
        text: "℗ 2000 Elektra Entertainment Group Inc.",
        type: "P",
      },
    ],
    external_ids: {
      isrc: "USWB10000001",
      ean: "0094636102222",
      upc: "094636102222",
    },
    genres: [],
    label: "Elektra",
    popularity: 0,
    album_group: "album",
    artists: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2",
        },
        href: "https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2",
        id: "3WrFJ7ztbogyGnTHbHJFl2",
        name: "The Doors",
        type: "artist",
        uri: "spotify:artist:3WrFJ7ztbogyGnTHbHJFl2",
      },
    ],
  },
  artists: [
    {
      external_urls: {
        spotify: "https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2",
      },
      followers: {
        href: "",
        total: 0,
      },
      genres: [],
      href: "https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2",
      id: "3WrFJ7ztbogyGnTHbHJFl2",
      images: [
        {
          url: "https://i.scdn.co/image/ab6761610000e5ebd2b2b2b2b2b2b2b2b2b2b2b2",
          height: 640,
          width: 640,
        },
        {
          url: "https://i.scdn.co/image/ab67616100005174d2b2b2b2b2b2b2b2b2b2b2b2",
          height: 300,
          width: 300,
        },
        {
          url: "https://i.scdn.co/image/ab67616d00001e02ccdddd46119a4ff53eaf1f5d",
          height: 64,
          width: 64,
        },
      ],
      name: "The Doors",
      popularity: 0,
      type: "artist",
      uri: "spotify:artist:3WrFJ7ztbogyGnTHbHJFl2",
    },
  ],
  available_markets: [
    "AD",
    "AE",
    "AR",
    "AT",
    "AU",
    "BE",
    "BG",
    "BH",
    "BO",
    "BR",
    "CA",
    "CH",
    "CL",
    "CO",
    "CR",
    "CY",
    "CZ",
    "DE",
    "DK",
    "DO",
    "DZ",
    "EC",
    "EE",
    "EG",
    "ES",
    "FI",
    "FR",
    "GB",
    "GR",
    "GT",
    "HK",
    "HN",
    "HU",
    "ID",
    "IE",
    "IL",
    "IN",
    "IS",
    "IT",
    "JO",
    "JP",
    "KW",
    "LB",
    "LI",
    "LT",
    "LU",
    "LV",
    "MA",
    "MC",
    "MT",
    "MX",
    "MY",
    "NI",
    "NL",
    "NO",
    "NZ",
    "OM",
    "PA",
    "PE",
    "PH",
    "PL",
    "PS",
    "PT",
    "PY",
    "QA",
    "RO",
    "SA",
    "SE",
    "SG",
    "SI",
    "SK",
    "SV",
    "TH",
    "TN",
    "TR",
    "TW",
    "US",
    "UY",
    "VN",
    "ZA",
  ],
  disc_number: 1,
  duration_ms: 0,
  explicit: false,
  external_ids: {
    isrc: "USWB10000001",
    ean: "0094636102222",
    upc: "094636102222",
  },
  external_urls: {
    spotify: "https://open.spotify.com/track/0eGsygTp906u18L0Oimnem",
  },
  href: "https://api.spotify.com/v1/tracks/0eGsygTp906u18L0Oimnem",
  id: "0eGsygTp906u18L0Oimnem",
  is_local: false,
  name: "The End",
  popularity: 0,
  preview_url: "",
  track_number: 1,
  type: "track",
  uri: "spotify:track:0eGsygTp906u18L0Oimnem",
  is_playable: false,
  restrictions: {
    reason: "market",
  },
};
