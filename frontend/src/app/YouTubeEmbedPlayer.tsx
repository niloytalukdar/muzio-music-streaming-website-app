"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type YouTubePlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      height: string;
      width: string;
      videoId: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: (event: { target: YouTubePlayer }) => void;
        onStateChange: (event: { data: number }) => void;
        onError: (event: { data: number }) => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type YouTubeEmbedPlayerHandle = {
  seekTo: (seconds: number) => void;
};

type YouTubeEmbedPlayerProps = {
  videoId: string;
  isPlaying: boolean;
  volume: number;
  onPlaybackChange: (state: "playing" | "paused" | "ended") => void;
  onProgress: (currentTime: number, duration: number) => void;
  onError: (code: number | null) => void;
};

let apiPromise: Promise<YouTubeApi> | undefined;

function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }
  if (apiPromise) {
    return apiPromise;
  }

  apiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const previousReadyCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReadyCallback?.();
      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        reject(new Error("YouTube's embedded player API did not initialize."));
      }
    };

    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => reject(new Error("YouTube's embedded player API could not load."));
      document.head.appendChild(script);
    }
  }).catch((error: unknown) => {
    apiPromise = undefined;
    throw error;
  });

  return apiPromise;
}

const YouTubeEmbedPlayer = forwardRef<YouTubeEmbedPlayerHandle, YouTubeEmbedPlayerProps>(
  function YouTubeEmbedPlayer(
    { videoId, isPlaying, volume, onPlaybackChange, onProgress, onError },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const readyRef = useRef(false);
    const isPlayingRef = useRef(isPlaying);
    const volumeRef = useRef(volume);
    const callbacksRef = useRef({ onPlaybackChange, onProgress, onError });

    useEffect(() => {
      isPlayingRef.current = isPlaying;
      volumeRef.current = volume;
      callbacksRef.current = { onPlaybackChange, onProgress, onError };
    }, [isPlaying, volume, onPlaybackChange, onProgress, onError]);

    useImperativeHandle(ref, () => ({
      seekTo(seconds) {
        playerRef.current?.seekTo(seconds, true);
      },
    }), []);

    useEffect(() => {
      let disposed = false;
      let playerContainer: HTMLDivElement | null = null;

      void loadYouTubeApi()
        .then((api) => {
          const container = containerRef.current;
          if (disposed || !container) {
            return;
          }

          const playerElement = document.createElement("div");
          container.appendChild(playerElement);
          playerContainer = container;

          const player = new api.Player(playerElement, {
            height: "100%",
            width: "100%",
            videoId,
            playerVars: {
              autoplay: isPlayingRef.current ? 1 : 0,
              controls: 1,
              enablejsapi: 1,
              origin: window.location.origin,
              playsinline: 1,
              rel: 0,
            },
            events: {
              onReady(event) {
                if (disposed) {
                  event.target.destroy();
                  return;
                }

                playerRef.current = event.target;
                readyRef.current = true;
                event.target.setVolume(Math.round(volumeRef.current * 100));
                callbacksRef.current.onProgress(0, event.target.getDuration());
                if (isPlayingRef.current) {
                  event.target.playVideo();
                }
              },
              onStateChange(event) {
                if (!window.YT) {
                  return;
                }

                if (event.data === window.YT.PlayerState.PLAYING) {
                  callbacksRef.current.onPlaybackChange("playing");
                } else if (event.data === window.YT.PlayerState.PAUSED) {
                  callbacksRef.current.onPlaybackChange("paused");
                } else if (event.data === window.YT.PlayerState.ENDED) {
                  callbacksRef.current.onPlaybackChange("ended");
                }
              },
              onError(event) {
                callbacksRef.current.onError(event.data);
              },
            },
          });
          playerRef.current = player;
        })
        .catch(() => {
          if (!disposed) {
            callbacksRef.current.onError(null);
          }
        });

      return () => {
        disposed = true;
        readyRef.current = false;
        playerRef.current?.destroy();
        playerRef.current = null;
        playerContainer?.replaceChildren();
      };
    }, [videoId]);

    useEffect(() => {
      const player = playerRef.current;
      if (!readyRef.current || !player) {
        return;
      }
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }, [isPlaying]);

    useEffect(() => {
      if (readyRef.current) {
        playerRef.current?.setVolume(Math.round(volume * 100));
      }
    }, [volume]);

    useEffect(() => {
      if (!isPlaying) {
        return;
      }

      const interval = window.setInterval(() => {
        const player = playerRef.current;
        if (readyRef.current && player) {
          callbacksRef.current.onProgress(player.getCurrentTime(), player.getDuration());
        }
      }, 1000);

      return () => window.clearInterval(interval);
    }, [isPlaying]);

    return <div ref={containerRef} className="youtube-player-frame" />;
  },
);

export default YouTubeEmbedPlayer;
