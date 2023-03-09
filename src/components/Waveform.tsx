import * as React from "react";
import { useRef, useEffect } from "react";

type WaveformProps = {
  waveform: number[];
  position: number;
  duration: number;
};

function Waveform({ waveform, position, duration }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) return;

    const context = canvas.getContext("2d");

    if (canvas.parentNode === null) return;

    const renderWaveform = () => {
      const { height, width } = (
        canvas.parentNode as Element
      ).getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;

      if (context === null) return;

      for (let x = 0; x < width; x++) {
        if (x % 8 === 0) {
          const i = Math.ceil(waveform.length * (x / width));
          const h = Math.round(waveform[i] * height) / 2;

          // percentage of the waveform that has been played based on position and duration
          const playedPercentage = position / duration;
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
              const r = 129 - (129 - 0) * ((gradientPercentage - 0.66) / 0.33);
              const g = 140 - (140 - 0) * ((gradientPercentage - 0.66) / 0.33);
              const b = 248 - (248 - 0) * ((gradientPercentage - 0.66) / 0.33);
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
    };

    renderWaveform();

    window.onresize = () => renderWaveform();

    return () => {
      window.onresize = null;
    };
  }, [waveform, position]);

  const milliToSeconds = (milli: number) => {
    // convert milli to mm:ss format
    const minutes = Math.floor(milli / 60000);
    const seconds = ((milli % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  return (
    <div className="mt-4 flex h-16">
      <div className="mx-auto flex h-full w-96 items-center">
        <div className="w-12 text-sm text-white">
          {milliToSeconds(position)}
        </div>
        <div className="flex h-full w-full" style={{ height: "100%" }}>
          <canvas className="" ref={canvasRef} />
        </div>
        <div className="w-12 text-sm text-white">
          {milliToSeconds(duration)}
        </div>
      </div>
    </div>
  );
}

export default Waveform;