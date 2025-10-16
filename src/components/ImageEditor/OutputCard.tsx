import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "./LoadingSpinner";
import { pollForGeneratedImage } from "@/services/api";
import { toast } from "sonner";

interface OutputCardProps {
  taskId: string | null;
  onGenerationComplete?: () => void;
}

export const OutputCard = ({ taskId, onGenerationComplete }: OutputCardProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!taskId) return;

    const fetchGeneratedImage = async () => {
      setIsLoading(true);
      setImage(null);
      
      try {
        const imageUrl = await pollForGeneratedImage(taskId);
        setImage(imageUrl);
        toast.success("Image edited successfully!");
      } catch (error) {
        toast.error("Failed to generate image");
        console.error("Generation error:", error);
      } finally {
        setIsLoading(false);
        onGenerationComplete?.();
      }
    };

    fetchGeneratedImage();
  }, [taskId]);
  return (
    <Card className="backdrop-blur-sm bg-card/50 border-2 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl">Output</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center w-full aspect-square rounded-lg border border-border bg-muted/10">
            <LoadingSpinner />
          </div>
        ) : image ? (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border">
            <img 
              src={image} 
              alt="Generated output" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed border-border bg-muted/10">
            <p className="text-muted-foreground">Generated image will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
