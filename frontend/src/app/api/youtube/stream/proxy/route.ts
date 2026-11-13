import { Innertube, UniversalCache } from "youtubei.js";

let innertubePromise: Promise<Innertube> | undefined;

async function getInnertube(): Promise<Innertube> {
  if (!innertubePromise) {
    innertubePromise = Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });
  }
  return await innertubePromise;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawVideoId = searchParams.get("videoId");

  if (!rawVideoId) {
    return new Response("Missing videoId parameter", { status: 400 });
  }

  const videoId = rawVideoId.replace(/^youtube:/, "");

  try {
    const innertube = await getInnertube();
    const stream = await innertube.download(videoId, {
      type: "audio",
      quality: "best",
      client: "YTMUSIC",
    });

    const headers = new Headers();
    headers.set("Content-Type", "audio/webm");
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=14400");

    return new Response(stream as any, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("InnerTube stream proxy error:", error);
    return new Response("Audio stream unavailable", { status: 502 });
  }
}
