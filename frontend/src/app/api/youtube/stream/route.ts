import { Innertube, UniversalCache } from "youtubei.js";

let innertubePromise: Promise<Innertube> | undefined;

async function getInnertube(): Promise<Innertube> {
  if (!innertubePromise) {
    innertubePromise = Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });
  }

  try {
    return await innertubePromise;
  } catch (err) {
    innertubePromise = undefined;
    throw err;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawVideoId = searchParams.get("videoId") || searchParams.get("id");

  if (!rawVideoId) {
    return Response.json({ error: "Missing videoId parameter" }, { status: 400 });
  }

  const videoId = rawVideoId.replace(/^youtube:/, "");

  try {
    const innertube = await getInnertube();
    const info = await innertube.getBasicInfo(videoId, { client: "YTMUSIC" });

    // Extract best audio format
    const format = info.chooseFormat({ type: "audio", quality: "best" });

    if (!format) {
      return Response.json({ error: "No suitable audio format found." }, { status: 404 });
    }

    // Direct deciphered streaming URL if available
    let streamUrl: string | null = null;
    try {
      streamUrl = await format.decipher(innertube.session.player);
    } catch {
      streamUrl = format.url || null;
    }

    return Response.json({
      videoId,
      streamUrl,
      mimeType: format.mime_type,
      bitrate: format.bitrate,
      contentLength: format.content_length,
      proxiedStreamUrl: `/api/youtube/stream/proxy?videoId=${encodeURIComponent(videoId)}`,
    }, {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("InnerTube stream resolution error:", error);
    return Response.json({
      error: error?.message || "Failed to resolve stream via InnerTube",
    }, { status: 500 });
  }
}
