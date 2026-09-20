import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

/** sessionStorage in the browser, undefined (a no-op persister) during SSR. */
function sessionStorageOrUndefined(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function makePersister() {
  return createAsyncStoragePersister({
    storage: sessionStorageOrUndefined(),
    key: "lacquer:query-cache",
    throttleTime: 1000,
  });
}

/** Bumped per deploy so a new build never reads a cache shape it no longer understands. */
export const CACHE_BUSTER = process.env.NEXT_PUBLIC_BUILD_ID ?? "lacquer-v1";
