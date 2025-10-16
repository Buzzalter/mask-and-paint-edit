import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { ImagePreview } from "./ImagePreview";
import { CanvasMask } from "./CanvasMask";
import { toast } from "sonner";
import { uploadImage, generateImage, uploadMask } from "@/services/api";

interface InputCardProps {
  onGenerate: (uuid: string) => void;
  isGenerating: boolean;
}

export const InputCard = ({ onGenerate, isGenerating }: InputCardProps) => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [imageUuid, setImageUuid] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [maskData, setMaskData] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Convert image to data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);

      // Upload to FastAPI backend
      const response = await uploadImage(file);
      setImageUuid(response.uuid);
      
      toast.success("Image uploaded successfully");
      console.log("Image uploaded with UUID:", response.uuid);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImageUuid("");
    setMaskData(null);
  };

  const convertMaskToBinaryPNG = (maskDataUrl: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Draw the mask image
        ctx.drawImage(img, 0, 0);
        
        // Get image data and convert to binary black/white
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          // If any color channel has value > 128, make it white (255), else black (0)
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const binaryValue = brightness > 128 ? 255 : 0;
          data[i] = binaryValue;     // R
          data[i + 1] = binaryValue; // G
          data[i + 2] = binaryValue; // B
          data[i + 3] = 255;         // A (fully opaque)
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to blob and then to File
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "mask.png", { type: "image/png" });
            resolve(file);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        }, "image/png");
      };
      img.onerror = () => reject(new Error("Failed to load mask image"));
      img.src = maskDataUrl;
    });
  };

  const handleGenerate = async () => {
    if (!imageUuid || !prompt || !selectedModel) {
      toast.error("Please upload an image, select a model, and enter a prompt");
      return;
    }

    try {
      // Upload mask if it exists
      if (maskData) {
        toast.info("Uploading mask...");
        const maskFile = await convertMaskToBinaryPNG(maskData);
        await uploadMask(imageUuid, maskFile);
        console.log("Mask uploaded successfully");
      }

      const payload = {
        uuid: imageUuid,
        prompt: prompt,
        model: selectedModel
      };

      console.log("Generating with payload:", payload);
      
      await generateImage(payload);
      onGenerate(imageUuid);
      
      toast.success("Generation started!");
    } catch (error) {
      toast.error("Failed to start generation");
      console.error("Generation error:", error);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-2 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl">Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model Name</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Option1">Option1</SelectItem>
              <SelectItem value="Option2">Option2</SelectItem>
              <SelectItem value="Option3">Option3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedModel && !imageUrl && (
          <ImageUpload onUpload={handleImageUpload} />
        )}

        {imageUrl && (
          <>
            <ImagePreview 
              imageUrl={imageUrl} 
              onRemove={handleRemoveImage}
              showCanvas={true}
            >
              <CanvasMask 
                imageUrl={imageUrl} 
                onMaskChange={setMaskData}
              />
            </ImagePreview>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your descriptive prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={() => {
                console.log("Generate button clicked", { 
                  prompt, 
                  isGenerating, 
                  isUploading, 
                  imageUuid,
                  selectedModel,
                  disabled: !prompt || isGenerating || isUploading || !selectedModel
                });
                handleGenerate();
              }} 
              className="w-full"
              disabled={!prompt || isGenerating || isUploading || !selectedModel}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
