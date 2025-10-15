import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
  showCanvas?: boolean;
  children?: React.ReactNode;
}

export const ImagePreview = ({ imageUrl, onRemove, showCanvas, children }: ImagePreviewProps) => {
  return (
    <div className="relative w-full">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border">
        <img 
          src={imageUrl} 
          alt="Uploaded preview" 
          className="w-full h-full object-contain"
        />
        {showCanvas && children}
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
