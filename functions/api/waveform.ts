export const main = async (argumentJson) => {
  const requestURL = argumentJson["requestUrl"];
  const params = new URLSearchParams(requestURL.split("?")[1]);

  // id is the string after the last slash in the url and before the query string
  const id = requestURL.split("/").pop().split("?")[0];

  const token = params.get("token");

  if (id === null) {
    return {
      statusCode: 400,
      body: "Invalid ID",
    };
  }
  if (token === null) {
    return {
      statusCode: 400,
      body: "Invalid token",
    };
  }

  const response = await fetch(
    `https://api.spotify.com/v1/audio-analysis/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = (await response.json()) as SpotifyAudioAnalysis;

  if (data.error?.status === 401 && data.error.message) {
    return {
      statusCode: 401,
      body: "Invalid ID",
    };
  } else if (response.ok) {
    const duration = data.track.duration;

    const segments = data.segments.map((segment) => {
      const loudness = segment.loudness_max;

      return {
        start: segment.start / duration,
        duration: segment.duration / duration,
        loudness: 1 - Math.min(Math.max(loudness, -35), 0) / -35,
      };
    });

    const min = Math.min(...segments.map((segment) => segment.loudness));
    const max = Math.max(...segments.map((segment) => segment.loudness));
    const levels = [];
    for (let i = 0.0; i < 1; i += 0.001) {
      const s = segments.find((segment) => {
        return i <= segment.start + segment.duration;
      });
      const loudness = Math.round((s.loudness / max) * 100) / 100;
      levels.push(loudness);
    }

    return {
      statusCode: 200,
      body: levels,
    };
  } else {
    return {
      statusCode: 500,
      body: "Server Error",
    };
  }
};

export type SpotifyAudioAnalysis = {
  meta: {
    analyzer_version: string;
    platform: string;
    detailed_status: string;
    status_code: number;
    timestamp: number;
    analysis_time: number;
    input_process: string;
  };
  track: {
    num_samples: number;
    duration: number;
    sample_md5: string;
    offset_seconds: number;
    window_seconds: number;
    analysis_sample_rate: number;
    analysis_channels: number;
    end_of_fade_in: number;
    start_of_fade_out: number;
    loudness: number;
    tempo: number;
    tempo_confidence: number;
    time_signature: number;
    time_signature_confidence: number;
    key: number;
    key_confidence: number;
    mode: number;
    mode_confidence: number;
    codestring: string;
    code_version: number;
    echoprintstring: string;
    echoprint_version: number;
    synchstring: string;
    synch_version: number;
    rhythmstring: string;
    rhythm_version: number;
  };
  bars: {
    start: number;
    duration: number;
    confidence: number;
  }[];
  beats: {
    start: number;
    duration: number;
    confidence: number;
  }[];
  sections: {
    start: number;
    duration: number;
    confidence: number;
    loudness: number;
    tempo: number;
    tempo_confidence: number;
    key: number;
    key_confidence: number;
    mode: number;
    mode_confidence: number;
    codestring: string;
    code_version: number;
    echoprintstring: string;
    echoprint_version: number;
    synchstring: string;
    synch_version: number;
    rhythmstring: string;
    rhythm_version: number;
  }[];
  segments: {
    start: number;
    duration: number;
    confidence: number;
    loudness_start: number;
    loudness_max_time: number;
    loudness_max: number;
    loudness_end: number;
    pitches: number[];
    timbre: number[];
  }[];
  tatums: {
    start: number;
    duration: number;
    confidence: number;
  }[];
  error?: {
    status: number;
    message: string;
  };
};
