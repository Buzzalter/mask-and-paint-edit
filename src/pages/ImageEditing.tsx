import { useState } from "react";
import { InputCard } from "@/components/ImageEditor/InputCard";
import { OutputCard } from "@/components/ImageEditor/OutputCard";

const ImageEditing = () => {
  const [uuid, setUuid] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = (imageUuid: string) => {
    setUuid(imageUuid);
    setIsGenerating(true);
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            Image Editing
          </h1>
          <p className="text-muted-foreground text-lg font-body">Transform your images with AI-powered editing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputCard onGenerate={handleGenerate} isGenerating={isGenerating} />
          <OutputCard uuid={uuid} onGenerationComplete={handleGenerationComplete} />
        </div>
      </div>
    </div>
  );
};

export default ImageEditing;
