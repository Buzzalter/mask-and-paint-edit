import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputCard } from "@/components/ImageEditor/InputCard";
import { OutputCard } from "@/components/ImageEditor/OutputCard";

const ImageEditing = () => {
  const [outputImage, setOutputImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Image Editing</h1>
          <p className="text-muted-foreground">Example instruction</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputCard onGenerate={setOutputImage} />
          <OutputCard image={outputImage} />
        </div>
      </div>
    </div>
  );
};

export default ImageEditing;
