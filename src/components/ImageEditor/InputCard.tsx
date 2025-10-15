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

interface InputCardProps {
  onGenerate: (image: string) => void;
}

export const InputCard = ({ onGenerate }: InputCardProps) => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [imageUuid, setImageUuid] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [maskData, setMaskData] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    // Convert image to data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);

    // Simulate API call to upload image and get UUID
    const simulatedUuid = crypto.randomUUID();
    setImageUuid(simulatedUuid);
    
    toast.success("Image uploaded successfully");
    console.log("Image uploaded with UUID:", simulatedUuid);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImageUuid("");
    setMaskData(null);
  };

  const handleGenerate = async () => {
    if (!imageUuid || !prompt) {
      toast.error("Please upload an image and enter a prompt");
      return;
    }

    // Simulate API call
    const payload = {
      uuid: imageUuid,
      prompt: prompt,
      ...(selectedModel === "Option3" && maskData ? { mask: maskData } : {})
    };

    console.log("Generating with payload:", payload);
    toast.success("Generation started!");

    // Simulate generation - in reality this would be the API response
    setTimeout(() => {
      onGenerate(imageUrl); // Using the same image as placeholder
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input</CardTitle>
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
              showCanvas={selectedModel === "Option3"}
            >
              {selectedModel === "Option3" && (
                <CanvasMask 
                  imageUrl={imageUrl} 
                  onMaskChange={setMaskData}
                />
              )}
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
              onClick={handleGenerate} 
              className="w-full"
              disabled={!prompt}
            >
              Generate
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
