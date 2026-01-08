import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Link as LinkIcon,
  X,
  Image as ImageIcon,
  Loader2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

interface AdImageUploaderProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  aspectHint?: string;
  previewAspect?: string;
  className?: string;
}

export function AdImageUploader({
  label,
  description,
  value,
  onChange,
  aspectHint,
  previewAspect = "aspect-[3/1]",
  className,
}: AdImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "ad-banners");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await res.json();
      const url = data.publicUrl || data.url;

      if (url) {
        onChange(url);
        toast.success(`${label} uploaded successfully`);
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base font-bold text-foreground">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {aspectHint && (
          <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground">
            {aspectHint}
          </span>
        )}
      </div>

      {value ? (
        <div
          className={cn(
            "relative rounded-xl overflow-hidden bg-muted border border-border group",
            previewAspect
          )}
        >
          <Image
            src={value}
            alt="Ad preview"
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-500"
            unoptimized // Since these are external/upload URLs that might not be in our next.config
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 rounded-full"
              onClick={() => window.open(value, "_blank")}
            >
              <Maximize2 className="h-3.5 w-3.5 mr-1" /> View Original
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-8 rounded-full"
              onClick={() => onChange("")}
            >
              <X className="h-3.5 w-3.5 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-6 text-center bg-card/50 transition-colors hover:bg-muted/30 relative",
            previewAspect
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-medium text-primary">
                Uploading image...
              </p>
            </div>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <ImageIcon className="h-6 w-6 text-muted-foreground opacity-50" />
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-sm font-bold text-foreground">
                  No image selected
                </p>
                <p className="text-xs text-muted-foreground px-4">
                  Drag and drop or click to upload the {label.toLowerCase()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" /> Upload File
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-2 h-9 text-muted-foreground"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                >
                  <LinkIcon className="h-3.5 w-3.5" />{" "}
                  {showUrlInput ? "Hide Link" : "Use Link"}
                </Button>
              </div>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
      )}

      {showUrlInput && !value && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Image URL
          </Label>
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-background"
            />
          </div>
        </div>
      )}
    </div>
  );
}
