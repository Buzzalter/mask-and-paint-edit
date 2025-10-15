import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-32 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-300"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Upload className="h-8 w-8" />
          <span>Click to upload image</span>
        </div>
      </Button>
    </div>
  );
};
