const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const START_YEAR = 1900;
const MIN_IN_MS = 60 * 1000;
const HOUR_IN_MS = MIN_IN_MS * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;
const WEEK_IN_MS = DAY_IN_MS * 7;

function pluralizeUnit(time, unit) {
  return `${time} ${unit}${ time > 1 ? 's' : ''}`;
}

/**
 * Show the "time ago" format for 7 days with increasing increments, minutes
 * to hours to days, then after that show the actual date. If it's a different
 * calendar year than the current, append the year as well.
 *
 * @param {Number} unixSeconds
 *        Seconds since epoch
 * @returns {String}
 *        Formatted representation of time elapsed since the passed-in time
*/
export default function formatElapsedTime(unixSeconds) {
  const now = new Date();
  const date = new Date(unixSeconds * 1000);
  const elapsedMs = now - date;

  if (elapsedMs > WEEK_IN_MS) {
    return date.getYear() === now.getYear()
      ? `${MONTHS[date.getMonth()]} ${date.getDate()}`
      : `${MONTHS[date.getMonth()]} ${date.getDate()}, ${START_YEAR + date.getYear()}`;
  }

  const days = Math.floor(elapsedMs / DAY_IN_MS);
  if (days >= 1) {
    return pluralizeUnit(days, 'day');
  }

  const hours = Math.floor(elapsedMs / HOUR_IN_MS);
  if (hours >= 1) {
    return pluralizeUnit(hours, 'hr');
  }

  const mins = Math.floor(elapsedMs / MIN_IN_MS);
  return pluralizeUnit(mins, 'min');
}
