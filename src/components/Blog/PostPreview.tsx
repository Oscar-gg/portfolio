import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const PostPreview = ({
  title,
  coverImage,
  content,
  authorName,
}: {
  title: string;
  coverImage: string;
  content: string;
  authorName: string;
}) => {
  return (
    <article className="flex flex-col">
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt={title}
          className="mb-8 max-h-[420px] w-full rounded-lg object-cover"
        />
      )}

      <h1 className="mb-2 text-4xl font-bold text-secondary">
        {title || "Untitled post"}
      </h1>
      <div className="mb-8 flex items-center gap-4 text-sm text-quaternary">
        <span>{authorName}</span>
        <span>
          {new Date().toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content ||
            "*Nothing to preview yet — start writing in the Edit tab.*"}
        </ReactMarkdown>
      </div>
    </article>
  );
};
