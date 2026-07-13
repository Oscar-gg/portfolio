import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import {
  BLOG_IMAGES_BUCKET,
  ensureBlogImagesBucket,
  supabaseAdmin,
} from "~/server/supabase";

const slugifyBaseName = (name: string) =>
  name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const publicUrlFor = (name: string) =>
  supabaseAdmin.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(name).data
    .publicUrl;

export const mediaRouter = createTRPCRouter({
  // All uploaded blog images, newest first. Admin only.
  list: adminProcedure.query(async () => {
    await ensureBlogImagesBucket();

    const { data, error } = await supabaseAdmin.storage
      .from(BLOG_IMAGES_BUCKET)
      .list("", { sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    return (data ?? [])
      .filter((file) => file.id) // skip folder placeholders
      .map((file) => ({
        name: file.name,
        size: (file.metadata as { size?: number } | null)?.size,
        createdAt: file.created_at,
        url: publicUrlFor(file.name),
      }));
  }),

  rename: adminProcedure
    .input(z.object({ name: z.string().min(1), newName: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const extMatch = /\.[^/.]+$/.exec(input.name);
      const extension = extMatch ? extMatch[0] : "";
      const base = slugifyBaseName(input.newName);
      if (!base) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid name" });
      }
      const newPath = `${base}-${randomUUID().slice(0, 8)}${extension}`;

      const { error } = await supabaseAdmin.storage
        .from(BLOG_IMAGES_BUCKET)
        .move(input.name, newPath);

      if (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }

      return { name: newPath, url: publicUrlFor(newPath) };
    }),

  delete: adminProcedure
    .input(z.object({ names: z.array(z.string().min(1)).min(1) }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin.storage
        .from(BLOG_IMAGES_BUCKET)
        .remove(input.names);

      if (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      }
    }),
});
