export const parseDateToKr = (dateString) => {
  const date = new Date(dateString);
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const koreaTimeDiff = 9 * 60 * 60 * 1000;

  return new Date(utc + koreaTimeDiff);
};
