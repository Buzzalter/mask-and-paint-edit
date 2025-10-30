import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageEditor/ImageUpload";
import { ImagePreview } from "@/components/ImageEditor/ImagePreview";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { uploadPoseImage, updatePose } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface PoseValues {
  pitch: number;
  yaw: number;
  roll: number;
  x_axis: number;
  y_axis: number;
  z_axis: number;
  pout: number;
  pursing: number;
  grin: number;
  lip_open_close: number;
  smile: number;
  wink: number;
  eyebrow: number;
  horizontal_gaze: number;
  vertical_gaze: number;
}

const PoseEditor = () => {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [poseValues, setPoseValues] = useState<PoseValues>({
    pitch: 0,
    yaw: 0,
    roll: 0,
    x_axis: 0,
    y_axis: 0,
    z_axis: 0,
    pout: 0,
    pursing: 0,
    grin: 0,
    lip_open_close: 0,
    smile: 0,
    wink: 0,
    eyebrow: 0,
    horizontal_gaze: 0,
    vertical_gaze: 0,
  });
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
      const response = await uploadPoseImage(file);
      setUuid(response.uuid);
      
      // Set initial values from API response
      if (response.initial_values) {
        setPoseValues(response.initial_values);
      }

      toast({
        title: "Image uploaded",
        description: "Initial pose values loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
    setImageFile(null);
    setImageUrl(null);
    setUuid(null);
    setResultImageUrl(null);
  };

  const handleSliderChange = async (key: keyof PoseValues, value: number[]) => {
    const newValues = { ...poseValues, [key]: value[0] };
    setPoseValues(newValues);

    if (!uuid) return;

    setIsProcessing(true);
    try {
      const response = await updatePose(uuid, newValues);
      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
      setResultImageUrl(response.image_url);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update pose",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const SliderControl = ({ 
    label, 
    value, 
    min, 
    max, 
    step, 
    valueKey 
  }: { 
    label: string; 
    value: number; 
    min: number; 
    max: number; 
    step: number;
    valueKey: keyof PoseValues;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-muted-foreground">{value.toFixed(2)}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(val) => handleSliderChange(valueKey, val)}
        disabled={!uuid || isProcessing}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            Pose Editor
          </h1>
          <p className="text-muted-foreground text-lg font-body">
            Adjust facial expressions and head pose with precision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              {!imageUrl ? (
                <ImageUpload onUpload={handleImageUpload} />
              ) : (
                <ImagePreview imageUrl={imageUrl} onRemove={handleRemoveImage} />
              )}
            </CardContent>
          </Card>

          {/* Controls Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Pose Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary">Head Pose</h3>
                <SliderControl label="Pitch" value={poseValues.pitch} min={-15} max={15} step={0.1} valueKey="pitch" />
                <SliderControl label="Yaw" value={poseValues.yaw} min={-15} max={15} step={0.1} valueKey="yaw" />
                <SliderControl label="Roll" value={poseValues.roll} min={-15} max={15} step={0.1} valueKey="roll" />
                <SliderControl label="X-Axis" value={poseValues.x_axis} min={-1.0} max={1.0} step={0.01} valueKey="x_axis" />
                <SliderControl label="Y-Axis" value={poseValues.y_axis} min={-1.0} max={1.0} step={0.01} valueKey="y_axis" />
                <SliderControl label="Z-Axis" value={poseValues.z_axis} min={-1.0} max={1.0} step={0.01} valueKey="z_axis" />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary">Expression</h3>
                <SliderControl label="Pout" value={poseValues.pout} min={-0.09} max={0.09} step={0.001} valueKey="pout" />
                <SliderControl label="Pursing" value={poseValues.pursing} min={-15} max={15} step={0.1} valueKey="pursing" />
                <SliderControl label="Grin" value={poseValues.grin} min={0} max={20} step={0.1} valueKey="grin" />
                <SliderControl label="Lip Open/Close" value={poseValues.lip_open_close} min={-90} max={120} step={1} valueKey="lip_open_close" />
                <SliderControl label="Smile" value={poseValues.smile} min={-0.3} max={1.3} step={0.01} valueKey="smile" />
                <SliderControl label="Wink" value={poseValues.wink} min={0} max={39} step={1} valueKey="wink" />
                <SliderControl label="Eyebrow" value={poseValues.eyebrow} min={-30} max={30} step={1} valueKey="eyebrow" />
                <SliderControl label="Horizontal Gaze" value={poseValues.horizontal_gaze} min={-30} max={30} step={1} valueKey="horizontal_gaze" />
                <SliderControl label="Vertical Gaze" value={poseValues.vertical_gaze} min={-30} max={30} step={1} valueKey="vertical_gaze" />
              </div>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              {resultImageUrl ? (
                <div className="space-y-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border">
                    <img 
                      src={resultImageUrl} 
                      alt="Result" 
                      className="w-full h-full object-contain"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">
                    {uuid ? "Adjust sliders to see results" : "Upload an image to begin"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoseEditor;
