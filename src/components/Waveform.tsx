import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { useSpotifyActions } from "../spotify/useSpotifyActions";
import { useSpotifyState } from "../spotify/useSpotifyState";
import { milliToSeconds } from "../utils/milliToSeconds";

function Waveform() {
  const spotifyActions = useSpotifyActions();
  const spotifyState = useSpotifyState();
  const track = spotifyState.selectedTrack;
  const trackState = spotifyState.trackState;

  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (trackState) {
      setPosition(trackState.position);
    }
  }, [trackState?.position]);

  // function that runs every 300 ms to update the position of the track
  useEffect(() => {
    const interval = setInterval(() => {
      if (!trackState?.paused) {
        setPosition((prevState) => prevState + 300);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [trackState?.paused]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) return;

    const context = canvas.getContext("2d");

    if (canvas.parentNode === null) return;

    const renderWaveform = () => {
      if (trackState && track?.waveform) {
        const { height, width } = (
          canvas.parentNode as Element
        ).getBoundingClientRect();

        canvas.width = width;
        canvas.height = height;

        if (context === null) return;

        for (let x = 0; x < width; x++) {
          if (x % 8 === 0) {
            const i = Math.ceil(track.waveform.length * (x / width));
            const h = Math.round(track.waveform[i] * height) / 2;

            // percentage of the waveform that has been played based on position and duration
            const playedPercentage = position / trackState.duration;
            // percentage of the waveform that is currently being rendered
            const currentPercentage = x / width;

            // make the waveform grey if it has not been played yet
            if (currentPercentage < playedPercentage) {
              const gradientPercentage = currentPercentage / 3;
              let gradientColor = "";
              if (gradientPercentage < 0.33) {
                const r = 249 - (249 - 216) * (gradientPercentage / 0.33);
                const g = 168 - (168 - 180) * (gradientPercentage / 0.33);
                const b = 212 - (212 - 254) * (gradientPercentage / 0.33);
                gradientColor = `rgb(${r} ${g} ${b})`;
              } else if (gradientPercentage < 0.66) {
                const r =
                  216 - (216 - 129) * ((gradientPercentage - 0.33) / 0.33);
                const g =
                  180 - (180 - 140) * ((gradientPercentage - 0.33) / 0.33);
                const b =
                  254 - (254 - 248) * ((gradientPercentage - 0.33) / 0.33);
                gradientColor = `rgb(${r} ${g} ${b})`;
              } else {
                const r =
                  129 - (129 - 0) * ((gradientPercentage - 0.66) / 0.33);
                const g =
                  140 - (140 - 0) * ((gradientPercentage - 0.66) / 0.33);
                const b =
                  248 - (248 - 0) * ((gradientPercentage - 0.66) / 0.33);
                gradientColor = `rgb(${r} ${g} ${b})`;
              }

              context.fillStyle = gradientColor;
            } else {
              context.fillStyle = "white";
            }

            context.fillRect(x, height / 2 - h, 4, h);
            context.fillRect(x, height / 2, 4, h);
          }
        }
      }
    };

    renderWaveform();

    window.onresize = () => renderWaveform();

    return () => {
      window.onresize = null;
    };
  }, [track?.waveform, position]);

  const handleWaveformClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (trackState) {
      const canvas = canvasRef.current;

      if (canvas === null) return;

      // get the x position of the click relative to the canvas
      const x = e.clientX - canvas.getBoundingClientRect().left;

      // get the percentage of the waveform that was clicked
      const percentage = x / canvas.width;

      // get the position in milliseconds that was clicked
      spotifyActions.seekToPosition(
        Math.ceil(trackState?.duration * percentage)
      );
    }
  };

  return (
    <div className="mt-4 flex h-16 lg:mt-0 lg:h-8">
      <div className="mx-auto flex h-full w-96 items-center">
        <div className="w-12 pr-2 text-sm text-white">
          {milliToSeconds(position || 0)}
        </div>
        <div
          className="flex h-full w-full"
          style={{ height: "100%" }}
          onClick={(e) => handleWaveformClick(e)}
        >
          <canvas className="" ref={canvasRef} />
        </div>
        <div className="w-12 pl-2 text-sm text-white">
          {milliToSeconds(trackState?.duration || 0)}
        </div>
      </div>
    </div>
  );
}

export default Waveform;
