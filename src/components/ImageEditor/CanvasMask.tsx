import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Eraser, Paintbrush } from "lucide-react";

interface CanvasMaskProps {
  imageUrl: string;
  onMaskChange: (maskData: string) => void;
}

export const CanvasMask = ({ imageUrl, onMaskChange }: CanvasMaskProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<"draw" | "erase">("draw");
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [brushSize, setBrushSize] = useState(20);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load the image to get its actual dimensions
    const img = new Image();
    img.onload = () => {
      // Set canvas to match actual image resolution
      canvas.width = img.width;
      canvas.height = img.height;
      setImageSize({ width: img.width, height: img.height });

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Initialize with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onMaskChange(canvas.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== "mousedown") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    // Scale coordinates from display size to actual canvas resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Scale line width based on canvas resolution and user-selected brush size
    const avgScale = (canvas.width / 800 + canvas.height / 800) / 2;
    ctx.lineWidth = brushSize * Math.max(avgScale, 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (mode === "draw") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    } else {
      ctx.globalCompositeOperation = "destination-out";
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div className="absolute inset-0">
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-3 bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-lg">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === "draw" ? "default" : "outline"}
            onClick={() => setMode("draw")}
            className="transition-all duration-200"
          >
            <Paintbrush className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={mode === "erase" ? "default" : "outline"}
            onClick={() => setMode("erase")}
            className="transition-all duration-200"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1 min-w-[160px]">
          <Label htmlFor="brush-size" className="text-xs">
            Brush Size: {brushSize}px
          </Label>
          <Slider
            id="brush-size"
            min={5}
            max={100}
            step={5}
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            className="cursor-pointer"
          />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};
