export const milliToSeconds = (milli: number) => {
  // convert milli to mm:ss format
  const minutes = Math.floor(milli / 60000);
  const seconds = ((milli % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, "0")}`;
};
