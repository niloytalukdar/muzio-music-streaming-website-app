import { Innertube, YTNodes } from "youtubei.js";

let innertubePromise: Promise<Innertube> | undefined;

const fetchWithTimeout: typeof fetch = (input, init) => {
  const timeout = AbortSignal.timeout(10_000);
  const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  return fetch(input, { ...init, signal });
};

async function getInnertube(): Promise<Innertube> {
  innertubePromise ??= Innertube.create({
    retrieve_player: false,
    fetch: fetchWithTimeout,
  });

  try {
    return await innertubePromise;
  } catch (error) {
    innertubePromise = undefined;
    throw error;
  }
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("q")?.trim() ?? "";
  const requestedLimit = Number(searchParams.get("limit") ?? 10);

  if (!query || query.length > 200) {
    return Response.json({ error: "Provide a search query of up to 200 characters." }, { status: 400 });
  }

  if (!Number.isInteger(requestedLimit) || requestedLimit < 1 || requestedLimit > 20) {
    return Response.json({ error: "Limit must be an integer between 1 and 20." }, { status: 400 });
  }

  try {
    const innertube = await getInnertube();
    let tracks: ReturnType<typeof mapMusicTrack>[] = [];

    try {
      const musicSearch = await innertube.music.search(query, { type: "song" });
      tracks = (musicSearch.songs?.contents ?? [])
        .filter((song) => song.item_type === "song" && Boolean(song.id && song.title?.trim()))
        .slice(0, requestedLimit)
        .map(mapMusicTrack);
    } catch (error) {
      console.warn("YouTube Music search failed; trying YouTube video search.", error);
    }

    if (tracks.length < requestedLimit) {
      const videoSearch = await innertube.search(query, { type: "video" });
      const existingIds = new Set(tracks.map((track) => track.id));
      const videoTracks = videoSearch.results
        .filterType(YTNodes.Video)
        .filter((video) => !video.is_live && !video.is_upcoming)
        .flatMap((video) => {
          const title = video.title.toString().trim();
          if (!video.video_id || !title || existingIds.has(`youtube:${video.video_id}`)) {
            return [];
          }

          return [{
            id: `youtube:${video.video_id}`,
            title,
            artistName: video.author.name || "Unknown creator",
            artworkUrl: video.best_thumbnail?.url ?? null,
            sourceUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(video.video_id)}`,
            audioStreamUrl: null,
            provider: "YouTube",
            durationSeconds: video.duration.seconds,
            isPlayable: false,
            licenseInformation: null,
          }];
        })
        .slice(0, requestedLimit - tracks.length);
      tracks = [...tracks, ...videoTracks];
    }

    return Response.json(tracks, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("YouTube.js search failed.", error);
    return Response.json({ error: "YouTube search is temporarily unavailable." }, { status: 502 });
  }
}

function mapMusicTrack(song: {
  id?: string;
  title?: string;
  artists?: { name: string }[];
  author?: { name: string };
  thumbnails: { url: string }[];
  duration?: { seconds: number };
}) {
  const videoId = song.id!;
  return {
    id: `youtube:${videoId}`,
    title: song.title!.trim(),
    artistName: song.artists?.map((artist) => artist.name).filter(Boolean).join(", ")
      || song.author?.name
      || "Unknown artist",
    artworkUrl: song.thumbnails.at(-1)?.url ?? null,
    sourceUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
    audioStreamUrl: null,
    provider: "YouTube Music",
    durationSeconds: song.duration?.seconds ?? 0,
    isPlayable: false,
    licenseInformation: null,
  };
}
