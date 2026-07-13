import { useState } from "react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { uploadImage } from "~/utils/uploadImage";
import { cn } from "~/utils/utils";

// Admin image management grid: upload, rename, delete, and (when `onSelect`
// is provided) pick an image for use elsewhere, e.g. the post editor.
export const MediaLibrary = ({
  enabled = true,
  onSelect,
}: {
  enabled?: boolean;
  onSelect?: (url: string) => void;
}) => {
  const utils = api.useContext();
  const { data: images, isLoading } = api.media.list.useQuery(undefined, {
    enabled,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [renamingName, setRenamingName] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const rename = api.media.rename.useMutation({
    onSuccess: async () => {
      setRenamingName(null);
      await utils.media.list.invalidate();
    },
    onError: (err) => setError(err.message),
  });

  const remove = api.media.delete.useMutation({
    onSuccess: async () => {
      await utils.media.list.invalidate();
    },
    onError: (err) => setError(err.message),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setIsUploading(true);
    try {
      await uploadImage(file);
      await utils.media.list.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const startRename = (name: string) => {
    setRenamingName(name);
    setRenameValue(name.replace(/\.[^/.]+$/, "").replace(/-[a-f0-9]{8}$/, ""));
  };

  const submitRename = (name: string) => {
    if (!renameValue.trim()) return;
    rename.mutate({ name, newName: renameValue.trim() });
  };

  const handleDelete = (name: string) => {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;
    remove.mutate({ names: [name] });
  };

  const handleCopy = async (name: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedName(name);
    setTimeout(() => setCopiedName((current) => (current === name ? null : current)), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "cursor-pointer",
            isUploading && "pointer-events-none opacity-50",
          )}
        >
          {isUploading ? "Uploading..." : "+ Upload image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => void handleUpload(e)}
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {isLoading && (
        <p className="text-sm text-quaternary/70">Loading images...</p>
      )}
      {!isLoading && images?.length === 0 && (
        <p className="text-sm text-quaternary/70">No images uploaded yet.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images?.map((image) => (
          <div
            key={image.name}
            className="flex flex-col gap-2 rounded-md border border-quaternary/20 p-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.name}
              className="h-24 w-full rounded object-cover"
            />

            {renamingName === image.name ? (
              <div className="flex flex-col gap-1">
                <Input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="h-8 text-xs"
                />
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 flex-1 text-xs"
                    disabled={rename.isLoading}
                    onClick={() => submitRename(image.name)}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 flex-1 text-xs"
                    onClick={() => setRenamingName(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p
                  className="truncate text-xs text-quaternary/70"
                  title={image.name}
                >
                  {image.name}
                </p>
                <div className="flex flex-wrap gap-1">
                  {onSelect && (
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 flex-1 text-xs"
                      onClick={() => onSelect(image.url)}
                    >
                      Use
                    </Button>
                  )}
                  {!onSelect && (
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 flex-1 text-xs"
                      onClick={() => void handleCopy(image.name, image.url)}
                    >
                      {copiedName === image.name ? "Copied!" : "Copy URL"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => startRename(image.name)}
                  >
                    Rename
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={remove.isLoading}
                    onClick={() => handleDelete(image.name)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
