export const buildImageUrl = (path?: string) => {
  if (!path) return "/no-image.png";
  if (path.startsWith("http")) return path;
  const url = `http://localhost:8080${path}`;
  try {
    // Try to append a cache-busting timestamp.
    const urlObject = new URL(url);
    urlObject.searchParams.set("t", new Date().getTime().toString());
    return urlObject.toString();
  } catch (e) {
    // If URL creation fails (e.g., in a non-browser environment),
    // fallback to a simpler method.
    return `${url}?t=${new Date().getTime()}`;
  }
};
