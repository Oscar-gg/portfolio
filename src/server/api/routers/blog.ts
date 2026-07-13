import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "~/env";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const postInput = z.object({
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export const blogRouter = createTRPCRouter({
  // Whether the current session belongs to the blog admin — used to show/hide
  // admin-only UI (new post, media library) on public blog pages.
  isAdmin: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user.email === env.ADMIN_EMAIL;
  }),

  // Published posts, newest first — used for the blog index, sitemap, and RSS feed.
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        viewCount: true,
        _count: { select: { comments: true } },
      },
    });
  }),

  // All posts including drafts — for the admin editor list. Admin only.
  listAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.blogPost.findUnique({
        where: { slug: input.slug },
        include: {
          author: { select: { name: true, image: true } },
          comments: {
            orderBy: { createdAt: "asc" },
            include: { author: { select: { name: true, image: true } } },
          },
        },
      });

      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      // Drafts are only visible to the admin previewing them.
      const isAdmin = ctx.session?.user.email === env.ADMIN_EMAIL;
      if (!post.published && !isAdmin) throw new TRPCError({ code: "NOT_FOUND" });

      return post;
    }),

  listComments: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { postId: input.postId },
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true, image: true } } },
      });
    }),

  incrementView: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.blogPost.updateMany({
        where: { slug: input.slug, published: true },
        data: { viewCount: { increment: 1 } },
      });
    }),

  create: adminProcedure.input(postInput).mutation(async ({ ctx, input }) => {
    const baseSlug = slugify(input.title);
    let slug = baseSlug;
    let suffix = 1;
    while (await ctx.db.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${++suffix}`;
    }

    return ctx.db.blogPost.create({
      data: {
        slug,
        title: input.title,
        excerpt: input.excerpt ? input.excerpt : null,
        content: input.content,
        coverImage: input.coverImage ? input.coverImage : null,
        published: input.published,
        publishedAt: input.published ? new Date() : null,
        author: { connect: { id: ctx.session.user.id } },
      },
    });
  }),

  update: adminProcedure
    .input(postInput.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.blogPost.findUnique({
        where: { id: input.id },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.blogPost.update({
        where: { id: input.id },
        data: {
          title: input.title,
          excerpt: input.excerpt ? input.excerpt : null,
          content: input.content,
          coverImage: input.coverImage ? input.coverImage : null,
          published: input.published,
          publishedAt:
            input.published && !existing.publishedAt
              ? new Date()
              : existing.publishedAt,
        },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.blogPost.delete({ where: { id: input.id } });
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string().min(1).max(2000),
        parentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.blogPost.findUnique({
        where: { id: input.postId },
      });
      if (!post?.published) throw new TRPCError({ code: "NOT_FOUND" });

      if (input.parentId) {
        const parent = await ctx.db.comment.findUnique({
          where: { id: input.parentId },
        });
        if (!parent || parent.postId !== input.postId) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
      }

      return ctx.db.comment.create({
        data: {
          content: input.content,
          post: { connect: { id: input.postId } },
          author: { connect: { id: ctx.session.user.id } },
          ...(input.parentId && { parent: { connect: { id: input.parentId } } }),
        },
        include: { author: { select: { name: true, image: true } } },
      });
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.id },
      });
      if (!comment) throw new TRPCError({ code: "NOT_FOUND" });

      const isAuthor = comment.authorId === ctx.session.user.id;
      const isAdmin = ctx.session.user.email === env.ADMIN_EMAIL;
      if (!isAuthor && !isAdmin) throw new TRPCError({ code: "FORBIDDEN" });

      // Soft delete: replies to this comment stay intact, and the deleted
      // comment renders as a placeholder instead of disappearing from the thread.
      await ctx.db.comment.update({
        where: { id: input.id },
        data: { content: "", deleted: true },
      });
    }),
});
