import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { MediaLibrary } from "~/components/Blog/MediaLibrary";

export const MediaPicker = ({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
          <DialogDescription>
            Upload, rename, delete, or select an image to use in your post.
          </DialogDescription>
        </DialogHeader>

        <MediaLibrary enabled={open} onSelect={onSelect} />
      </DialogContent>
    </Dialog>
  );
};
