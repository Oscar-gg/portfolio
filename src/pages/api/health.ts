import { type NextApiRequest, type NextApiResponse } from "next";

import { env } from "~/env";
import { db } from "~/server/db";
import { BLOG_IMAGES_BUCKET, supabaseAdmin } from "~/server/supabase";

export const config = {
  api: {
    // no body expected
    bodyParser: false,
  },
};

type CheckResult = {
  ok: boolean;
  latencyMs: number;
  error?: string;
};

async function timed(fn: () => Promise<unknown>): Promise<CheckResult> {
  const start = Date.now();
  try {
    await fn();
    return { ok: true, latencyMs: Date.now() - start };
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const [database, storage] = await Promise.all([
    timed(() => db.$queryRaw`SELECT 1`),
    timed(() =>
      supabaseAdmin.storage
        .from(BLOG_IMAGES_BUCKET)
        .list("", { limit: 1 })
        .then(({ error }) => {
          if (error) throw error;
        }),
    ),
  ]);

  const healthy = database.ok && storage.ok;

  res.setHeader("Cache-Control", "no-store, max-age=0");

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    uptimeSeconds: Math.round(process.uptime()),
    checks: { database, storage },
  });
}
