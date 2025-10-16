import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "./LoadingSpinner";
import { getStatus, getGeneratedImage } from "@/services/api";
import { toast } from "sonner";

interface OutputCardProps {
  uuid: string | null;
  onGenerationComplete?: () => void;
}

export const OutputCard = ({ uuid, onGenerationComplete }: OutputCardProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!uuid) return;

    const pollStatus = async () => {
      try {
        const statusResponse = await getStatus(uuid);
        setStatus(statusResponse.status);
        setProgress(statusResponse.progress);

        if (statusResponse.status === "Complete") {
          // Stop polling
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
          }

          // Fetch the final image
          const imageResponse = await getGeneratedImage(uuid);
          setImage(imageResponse.image_url);
          setIsLoading(false);
          toast.success("Image edited successfully!");
          onGenerationComplete?.();
        }
      } catch (error) {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
        toast.error("Failed to generate image");
        console.error("Status polling error:", error);
        setIsLoading(false);
        onGenerationComplete?.();
      }
    };

    // Start polling
    setIsLoading(true);
    setImage(null);
    setStatus("");
    setProgress(0);
    
    pollStatus(); // Initial poll
    pollingInterval.current = setInterval(pollStatus, 1000); // Poll every second

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [uuid, onGenerationComplete]);
  return (
    <Card className="backdrop-blur-sm bg-card/50 border-2 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl">Output</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center w-full aspect-square rounded-lg border border-border bg-muted/10">
            <LoadingSpinner status={status} progress={progress} />
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
