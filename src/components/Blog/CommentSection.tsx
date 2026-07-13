import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";

export interface CommentDTO {
  id: string;
  content: string;
  createdAt: string | Date;
  authorId: string;
  parentId: string | null;
  deleted: boolean;
  anonymous: boolean;
  author: { name: string | null; image: string | null };
}

const getInitials = (name: string | null) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const CommentItem = ({
  comment,
  repliesByParent,
  depth,
  currentUserId,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  replyAnonymous,
  setReplyAnonymous,
  onReplySubmit,
  onDelete,
  onToggleAnonymous,
  isReplying,
  isDeleting,
  isTogglingAnonymous,
}: {
  comment: CommentDTO;
  repliesByParent: Map<string, CommentDTO[]>;
  depth: number;
  currentUserId: string | undefined;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (value: string) => void;
  replyAnonymous: boolean;
  setReplyAnonymous: (value: boolean) => void;
  onReplySubmit: (parentId: string) => void;
  onDelete: (id: string) => void;
  onToggleAnonymous: (id: string, anonymous: boolean) => void;
  isReplying: boolean;
  isDeleting: boolean;
  isTogglingAnonymous: boolean;
}) => {
  const isOwnComment = comment.authorId === currentUserId && !comment.deleted;
  const canDelete = isOwnComment;
  const replies = repliesByParent.get(comment.id) ?? [];
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <li
      className="rounded-lg border border-gray-700 p-4"
      style={depth > 0 ? { marginLeft: Math.min(depth, 4) * 24 } : undefined}
    >
      <div className="mb-1 flex items-center gap-2">
        {replies.length > 0 && (
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-xs text-quaternary hover:text-secondary"
            aria-label={isCollapsed ? "Expand replies" : "Collapse replies"}
          >
            {isCollapsed ? "[+]" : "[-]"}
          </button>
        )}
        <span className="font-semibold text-secondary">
          {comment.deleted ? "[deleted]" : comment.author.name ?? "Anonymous"}
        </span>
        <span className="ml-auto text-xs text-quaternary">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>

      {isCollapsed ? (
        <p className="text-xs italic text-quaternary/60">
          {countDescendants(replies, repliesByParent)} repl
          {countDescendants(replies, repliesByParent) === 1 ? "y" : "ies"}{" "}
          hidden
        </p>
      ) : (
        <>
          <p className="whitespace-pre-wrap text-quaternary">
            {comment.deleted ? (
              <span className="italic text-quaternary/60">
                [comment deleted]
              </span>
            ) : (
              comment.content
            )}
          </p>

          <div className="mt-2 flex gap-3 text-xs">
            {currentUserId && (
              <button
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
                className="text-palette-blue underline"
              >
                Reply
              </button>
            )}
            {isOwnComment && (
              <button
                onClick={() =>
                  onToggleAnonymous(comment.id, !comment.anonymous)
                }
                disabled={isTogglingAnonymous}
                className="text-palette-blue underline"
              >
                {comment.anonymous
                  ? "Show my name"
                  : `Show as ${getInitials(comment.author.name)}`}
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="text-destructive underline"
              >
                Delete
              </button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-3 flex flex-col gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
              />
              <label className="flex items-center gap-2 text-xs text-quaternary">
                <input
                  type="checkbox"
                  checked={replyAnonymous}
                  onChange={(e) => setReplyAnonymous(e.target.checked)}
                />
                Post anonymously (shows initials only)
              </label>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isReplying || !replyContent.trim()}
                  onClick={() => onReplySubmit(comment.id)}
                >
                  {isReplying ? "Posting..." : "Post reply"}
                </Button>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <ul className="mt-4 flex flex-col gap-4">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  repliesByParent={repliesByParent}
                  depth={depth + 1}
                  currentUserId={currentUserId}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  replyAnonymous={replyAnonymous}
                  setReplyAnonymous={setReplyAnonymous}
                  onReplySubmit={onReplySubmit}
                  onDelete={onDelete}
                  onToggleAnonymous={onToggleAnonymous}
                  isReplying={isReplying}
                  isDeleting={isDeleting}
                  isTogglingAnonymous={isTogglingAnonymous}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
};

const countDescendants = (
  comments: CommentDTO[],
  repliesByParent: Map<string, CommentDTO[]>,
): number => {
  return comments.reduce(
    (total, comment) =>
      total +
      1 +
      countDescendants(repliesByParent.get(comment.id) ?? [], repliesByParent),
    0,
  );
};

export const CommentSection = ({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: CommentDTO[];
}) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyAnonymous, setReplyAnonymous] = useState(false);
  const utils = api.useContext();

  const { data: fetchedComments } = api.blog.listComments.useQuery({
    postId,
  });
  const comments = fetchedComments ?? initialComments;

  const topLevel = comments.filter((comment) => !comment.parentId);
  const repliesByParent = new Map<string, CommentDTO[]>();
  for (const comment of comments) {
    if (!comment.parentId) continue;
    const siblings = repliesByParent.get(comment.parentId) ?? [];
    siblings.push(comment);
    repliesByParent.set(comment.parentId, siblings);
  }

  const addComment = api.blog.addComment.useMutation({
    onSuccess: () => {
      setContent("");
      setAnonymous(false);
      setReplyingTo(null);
      setReplyContent("");
      setReplyAnonymous(false);
      void utils.blog.listComments.invalidate({ postId });
    },
  });

  const deleteComment = api.blog.deleteComment.useMutation({
    onSuccess: () => void utils.blog.listComments.invalidate({ postId }),
  });

  const toggleAnonymous = api.blog.setCommentAnonymous.useMutation({
    onSuccess: () => void utils.blog.listComments.invalidate({ postId }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment.mutate({ postId, content: content.trim(), anonymous });
  };

  const handleReplySubmit = (parentId: string) => {
    if (!replyContent.trim()) return;
    addComment.mutate({
      postId,
      content: replyContent.trim(),
      parentId,
      anonymous: replyAnonymous,
    });
  };

  return (
    <section className="mt-12" id="comments">
      <h2 className="mb-4 text-2xl font-bold text-secondary">
        Comments ({comments.length})
      </h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
          />
          <label className="flex items-center gap-2 text-xs text-quaternary">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Post anonymously (shows initials only)
          </label>
          <Button
            type="submit"
            disabled={addComment.isLoading || !content.trim()}
            className="self-end"
          >
            {addComment.isLoading ? "Posting..." : "Post comment"}
          </Button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-quaternary">
          <button
            onClick={() => void signIn("google")}
            className="text-palette-blue underline"
          >
            Sign in
          </button>{" "}
          to leave a comment.
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {topLevel.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            repliesByParent={repliesByParent}
            depth={0}
            currentUserId={session?.user.id}
            replyingTo={replyingTo}
            setReplyingTo={(id) => {
              setReplyingTo(id);
              setReplyContent("");
            }}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            replyAnonymous={replyAnonymous}
            setReplyAnonymous={setReplyAnonymous}
            onReplySubmit={handleReplySubmit}
            onDelete={(id) => deleteComment.mutate({ id })}
            onToggleAnonymous={(id, anonymous) =>
              toggleAnonymous.mutate({ id, anonymous })
            }
            isReplying={addComment.isLoading}
            isDeleting={deleteComment.isLoading}
            isTogglingAnonymous={toggleAnonymous.isLoading}
          />
        ))}
      </ul>
    </section>
  );
};
