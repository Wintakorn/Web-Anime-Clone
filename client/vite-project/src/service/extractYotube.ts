export const extractYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
  return match ? match[1] : '';
};
