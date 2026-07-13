import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";

// Server-only client using the service role key — bypasses RLS/storage
// policies
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

export const BLOG_IMAGES_BUCKET = "blog-images";

let bucketEnsured = false;
export async function ensureBlogImagesBucket() {
  if (bucketEnsured) return;
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((bucket) => bucket.name === BLOG_IMAGES_BUCKET)) {
    await supabaseAdmin.storage.createBucket(BLOG_IMAGES_BUCKET, {
      public: true,
      fileSizeLimit: "8MB",
    });
  }
  bucketEnsured = true;
}
