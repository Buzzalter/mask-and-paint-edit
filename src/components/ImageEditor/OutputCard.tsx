import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OutputCardProps {
  image: string | null;
}

export const OutputCard = ({ image }: OutputCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Output</CardTitle>
      </CardHeader>
      <CardContent>
        {image ? (
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
