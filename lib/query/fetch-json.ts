import type { z } from "zod";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Fetches JSON and parses it with a Zod schema; non-2xx responses become ApiError. */
export async function fetchJson<T extends z.ZodType>(
  input: string,
  schema: T,
  init?: RequestInit,
): Promise<z.infer<T>> {
  let res: Response;
  try {
    res = await fetch(input, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("You appear to be offline. Check your connection and try again.", 0);
  }
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const b = body as { error?: string; code?: string } | null;
    throw new ApiError(b?.error ?? "Something on our side failed. Try again in a minute.", res.status, b?.code);
  }
  return schema.parse(body);
}
