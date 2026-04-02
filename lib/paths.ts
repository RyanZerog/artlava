const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;

export function withBasePath(path: string) {
  if (!path) {
    return BASE_PATH || "/";
  }

  if (ABSOLUTE_URL_PATTERN.test(path) || path.startsWith("data:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalizedPath}`;
}

export function cssBackgroundUrl(path: string) {
  return `url(${withBasePath(path)})`;
}
