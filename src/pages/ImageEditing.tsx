import { useState } from "react";
import { InputCard } from "@/components/ImageEditor/InputCard";
import { OutputCard } from "@/components/ImageEditor/OutputCard";

const ImageEditing = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = (newTaskId: string) => {
    setTaskId(newTaskId);
    setIsGenerating(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Image Editing
          </h1>
          <p className="text-muted-foreground text-lg">Example instruction</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputCard onGenerate={handleGenerate} isGenerating={isGenerating} />
          <OutputCard taskId={taskId} />
        </div>
      </div>
    </div>
  );
};

export default ImageEditing;
