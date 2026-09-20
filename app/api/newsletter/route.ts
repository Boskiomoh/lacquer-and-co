import { z } from "zod";
import { email } from "@/lib/providers/email";
import { newsletterSchema, type NewsletterResponse } from "@/lib/schemas/newsletter";

const noStore = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const parsed = newsletterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Enter an email address like name@example.com.", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 400, headers: noStore },
    );
  }
  try {
    const body: NewsletterResponse = { status: await email.subscribe(parsed.data.email) };
    return Response.json(body, { headers: noStore });
  } catch (error) {
    console.error("[newsletter]", error);
    return Response.json(
      { error: "The mailing list did not accept that just now. Try again in a minute." },
      { status: 502, headers: noStore },
    );
  }
}
