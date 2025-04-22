// given number of seconds, convert to hour:minute:second
// if hours is 0, return minute:second
// if minutes is 0, return second
// if hours and minutes are 0, return seconds
// should pad to 00 if less than 10 but to second only

export const convertToHourMinuteSecond = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes}:${secondsLeft.toString().padStart(2, "0")}`;
  }
  if (minutes > 0) {
    return `${minutes}:${secondsLeft.toString().padStart(2, "0")}`;
  }
  return `${secondsLeft.toString().padStart(2, "0")}`;
};

export const convertToTimeObject = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;
  return { hours, minutes, seconds: secondsLeft };
};

export const formatTimeObjectToSeconds = ({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}): number => {
  return hours * 3600 + minutes * 60 + seconds;
};
