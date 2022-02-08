export default function getReadableTimestamp(timestamp: string): string {
  const createdTime = new Date(timestamp).getTime();
  const currentTime = Date.now() / 1000;

  // Time constants.
  const SECS_PER_MINUTE = 60,
    SECS_PER_HOUR = SECS_PER_MINUTE * 60,
    SECS_PER_DAY = SECS_PER_HOUR * 24,
    SECS_PER_MONTH = SECS_PER_DAY * 30;

  const elapsedTime = Math.floor(currentTime - createdTime);

  if (elapsedTime < SECS_PER_MINUTE) {
    return "just now";
  }
  if (elapsedTime < SECS_PER_HOUR) {
    const minutes = Math.round(elapsedTime / SECS_PER_MINUTE);
    if (minutes === 1) {
      return "A minute ago";
    } else {
      return `${minutes} minutes ago`;
    }
  }
  if (elapsedTime < SECS_PER_DAY) {
    const hours = Math.round(elapsedTime / SECS_PER_HOUR);
    if (hours === 1) {
      return "An hour ago";
    } else {
      return `${hours} hours ago`;
    }
  }
  if (elapsedTime < SECS_PER_MONTH) {
    const days = Math.round(elapsedTime / SECS_PER_DAY);
    if (days === 1) {
      return "A day ago";
    } else {
      return `${days} days ago`;
    }
  } else {
    return new Date(timestamp).toDateString();
  }
}
