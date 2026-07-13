import { randomUUID } from "crypto";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";
import {
  BLOG_IMAGES_BUCKET,
  ensureBlogImagesBucket,
  supabaseAdmin,
} from "~/server/supabase";

export const config = {
  api: {
    bodyParser: { sizeLimit: "8mb" },
  },
};

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const uploadInput = z.object({
  contentType: z.enum(["image/png", "image/jpeg", "image/webp", "image/gif"]),
  // base64-encoded file contents, without the "data:...;base64," prefix
  data: z.string().min(1),
  filename: z.string().min(1).optional(),
});

const slugifyBaseName = (name: string) =>
  name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerAuthSession({ req, res });
  if (!session || session.user.email !== env.ADMIN_EMAIL) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const parsed = uploadInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid upload payload" });
  }
  const { contentType, data, filename } = parsed.data;

  const buffer = Buffer.from(data, "base64");
  if (buffer.length > 8 * 1024 * 1024) {
    return res.status(413).json({ error: "Image too large (max 8MB)" });
  }

  await ensureBlogImagesBucket();

  const extension = ALLOWED_TYPES[contentType];
  const base = filename ? slugifyBaseName(filename) : "";
  const path = `${base ? `${base}-` : ""}${randomUUID().slice(0, 8)}.${extension}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BLOG_IMAGES_BUCKET)
    .upload(path, buffer, { contentType, upsert: false });

  if (uploadError) {
    return res.status(500).json({ error: uploadError.message });
  }

  const { data: publicUrl } = supabaseAdmin.storage
    .from(BLOG_IMAGES_BUCKET)
    .getPublicUrl(path);

  return res.status(200).json({ url: publicUrl.publicUrl });
}
