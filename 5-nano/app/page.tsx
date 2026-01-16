"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Code,
  Zap,
  ImageIcon,
  Download,
  Maximize2,
  Wand2,
  Info,
  User,
  CheckCircle2,
  AlertCircle,
  Command,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
type Resolution = "1K" | "2K" | "4K";
type ImageFormat = "PNG" | "JPEG";
type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
  settings: {
    ar: AspectRatio;
    res: Resolution;
    fmt: ImageFormat;
  };
  timestamp: number;
};

// --- Mock Data ---
const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1706059632832-1b12b5e7d589?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1706560932207-6c30f7b9c9e8?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2400&auto=format&fit=crop",
];

// --- Components ---

const Button = ({
  className,
  variant = "primary",
  size = "default",
  isLoading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "magic" | "brand";
  size?: "default" | "sm" | "icon" | "xs";
  isLoading?: boolean;
}) => {
  const variants = {
    // Supabase-like buttons
    primary: "bg-[#EDEDED] text-black hover:bg-white border border-[#EDEDED] shadow-sm", // White primary
    brand: "bg-[#FFEA00] text-black hover:bg-[#FFD600] border border-[#FFEA00]/50 shadow-[0_0_15px_-3px_rgba(255,234,0,0.3)]", // Banana Yellow
    secondary: "bg-[#232323] text-[#EDEDED] hover:bg-[#2a2a2a] border border-[#333]",
    ghost: "text-[#888888] hover:text-[#EDEDED] hover:bg-[#232323]",
    outline: "border border-[#333] text-[#EDEDED] hover:border-[#555] bg-transparent",
    magic: "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white hover:opacity-90 border-0 shadow-lg shadow-purple-500/20",
  };

  const sizes = {
    default: "h-9 px-4 py-2", // Slightly shorter standard height
    sm: "h-8 px-3 text-xs",
    xs: "h-6 px-2 text-[10px]",
    icon: "h-8 w-8 p-0 flex items-center justify-center",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[4px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFEA00]/50 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />}
      {children}
    </button>
  );
};

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Tooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-[#1C1C1C] border border-[#333] text-[#EDEDED] text-[11px] leading-tight rounded shadow-xl w-max max-w-[200px] whitespace-normal z-50 pointer-events-none"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LabelWithTooltip = ({ label, tooltip, required }: { label: string, tooltip: string, required?: boolean }) => (
  <div className="flex items-center gap-1.5 mb-2">
    <label className="text-[11px] font-normal text-[#888888] flex items-center gap-0.5">
      {label}
      {required && <span className="text-red-500/80 ml-0.5">*</span>}
    </label>
    <Tooltip content={tooltip}>
      <Info className="w-3 h-3 text-[#444] hover:text-[#888] cursor-help transition-colors" />
    </Tooltip>
  </div>
);

// --- Page ---

export default function AIPlayground() {
  // State
  const [prompt, setPrompt] = useState("");
  const [refImages, setRefImages] = useState<File[]>([]);
  const [ar, setAr] = useState<AspectRatio>("1:1");
  const [resolution, setResolution] = useState<Resolution>("1K");
  const [format, setFormat] = useState<ImageFormat>("PNG");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // User Account Mock
  const [user, setUser] = useState<{ name: string; isPro: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setRefImages((prev) => [...prev, ...Array.from(e.target.files!).slice(0, 14 - prev.length)]);
    }
  };

  const removeFile = (index: number) => {
    setRefImages((prev) => prev.filter((_, i) => i !== index));
  };

  const enhancePrompt = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    await new Promise(r => setTimeout(r, 800)); // Mock delay
    setPrompt(prev => prev + ", highly detailed, 8k resolution, cinematic lighting, photorealistic, trending on artstation, unreal engine 5 render");
    setIsEnhancing(false);
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      url: MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
      prompt,
      settings: { ar, res: resolution, fmt: format },
      timestamp: Date.now(),
    };

    setGeneratedImages((prev) => [newImage, ...prev]);
    setIsGenerating(false);
  };

  const getCodeSnippet = () => {
    return `
import requests

url = "https://api.nano-banana.ai/v3/generate"

payload = {
    "prompt": "${prompt || "Your prompt here..."}",
    "aspect_ratio": "${ar}",
    "resolution": "${resolution}",
    "format": "${format.toLowerCase()}",
    "reference_images": ${refImages.length > 0 ? `[${refImages.map(f => `"${f.name}"`).join(", ")}]` : "[]"}
}

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
`.trim();
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-[#121212] text-[#EDEDED] overflow-hidden font-sans selection:bg-[#FFEA00]/30 selection:text-[#FFEA00]">

      {/* --- Left Sidebar: Controls --- */}
      <aside className="w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-[#2C2C2C] bg-[#181818] md:h-full overflow-y-auto custom-scrollbar">

        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-[#2C2C2C]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#FFEA00] flex items-center justify-center shadow-[0_0_10px_-2px_rgba(255,234,0,0.4)]">
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
            </div>
            <span className="text-sm font-medium text-[#EDEDED]">Playground</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 pl-2 pr-1 py-1 rounded border transition-all cursor-pointer select-none text-[11px]",
              user ? "bg-[#232323] border-[#333] hover:border-[#444]" : "bg-transparent border-dashed border-[#333] hover:border-[#555] text-[#888]"
            )}
            onClick={() => setUser(user ? null : { name: "User", isPro: true })}
          >
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FFEA00]" />
                <span>Pro Team</span>
                <ChevronDown className="w-3 h-3 text-[#666]" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-1">
                <GoogleIcon className="w-3.5 h-3.5" />
                <span className="text-[#EDEDED] font-medium">Connect to Google</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8 flex-1">

          {/* Account Status Banner */}
          <AnimatePresence>
            {!user && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#232323] border border-[#333] rounded-[4px] p-3 flex items-start gap-3 cursor-pointer" onClick={() => setUser({ name: "User", isPro: true })}>
                  <AlertCircle className="w-4 h-4 text-[#888] mt-0.5" />
                  <div>
                    <h4 className="text-xs font-medium text-[#EDEDED]">Connect Account</h4>
                    <p className="text-[11px] text-[#888] mt-0.5 leading-tight">Link your Google account to unlock 4K Ultra resolution.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt */}
          <div className="space-y-1">
            <div className="flex justify-between items-end mb-1">
              <LabelWithTooltip
                label="Prompt"
                tooltip="Describe the image you want to generate in detail."
                required
              />
              <button
                onClick={enhancePrompt}
                disabled={isEnhancing}
                className="flex items-center gap-1 text-[10px] text-[#FFEA00] hover:text-[#FFEA00]/80 transition-colors disabled:opacity-50"
              >
                <Wand2 className={cn("w-3 h-3", isEnhancing && "animate-spin")} />
                {isEnhancing ? "Enhancing..." : "Enhance"}
              </button>
            </div>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see..."
                className="w-full min-h-[120px] rounded-[4px] border border-[#333] bg-[#232323] p-3 text-sm text-[#EDEDED] placeholder:text-[#555] focus:border-[#FFEA00] focus:outline-none focus:ring-1 focus:ring-[#FFEA00] resize-none transition-all duration-150 shadow-inner"
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-[#555] font-mono">
                {prompt.length} chars
              </div>
            </div>
          </div>

          {/* Multimodal Inputs */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <LabelWithTooltip
                label="Reference Images"
                tooltip="Upload up to 14 images to guide the generation style or content."
                required
              />
              <span className="text-[10px] text-[#555]">{refImages.length} / 14</span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#333] hover:border-[#555] hover:bg-[#232323] rounded-[4px] py-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group bg-[#1A1A1A]"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="w-8 h-8 rounded-full bg-[#232323] border border-[#333] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="w-3.5 h-3.5 text-[#888]" />
              </div>
              <p className="text-[11px] text-[#666]">
                <span className="text-[#888] font-medium underline underline-offset-2">Upload</span> or drag files
              </p>
            </div>

            {/* Thumbs - Ordered Containers */}
            {refImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3 p-2 bg-[#232323] rounded-[4px] border border-[#333]">
                <AnimatePresence>
                  {refImages.map((file, i) => (
                    <motion.div
                      key={`${file.name}-${i}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="relative aspect-square rounded-[3px] overflow-hidden border border-[#444] group bg-[#121212]"
                    >
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover transition-opacity" />

                      {/* Order Badge */}
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-sm text-[9px] font-mono text-white pointer-events-none">
                        {i + 1}
                      </div>

                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-red-500/80 text-white rounded-sm p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Config Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">

            {/* Aspect Ratio */}
            <div className="space-y-1">
              <LabelWithTooltip
                label="Aspect Ratio"
                tooltip="Select the dimensions of the generated image."
              />
              <div className="flex flex-col gap-1">
                {["1:1", "16:9", "9:16", "4:3", "3:4"].slice(0, 3).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAr(r as AspectRatio)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-[4px] text-xs transition-all border",
                      ar === r
                        ? "bg-[#232323] border-[#FFEA00] text-[#EDEDED]"
                        : "bg-transparent border-transparent text-[#888] hover:bg-[#232323] hover:text-[#bbb]"
                    )}
                  >
                    <span>{r}</span>
                    {ar === r && <CheckCircle2 className="w-3 h-3 text-[#FFEA00]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-1">
              <LabelWithTooltip
                label="Resolution"
                tooltip="Higher resolution requires a Pro account."
              />
              <div className="flex flex-col gap-1">
                {(["1K", "2K", "4K"] as Resolution[]).map((r) => {
                  const isLocked = r === "4K" && !user?.isPro;
                  return (
                    <button
                      key={r}
                      onClick={() => !isLocked && setResolution(r)}
                      disabled={isLocked}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-[4px] text-xs transition-all border relative",
                        resolution === r
                          ? "bg-[#232323] border-[#FFEA00] text-[#EDEDED]"
                          : "bg-transparent border-transparent text-[#888] hover:bg-[#232323] hover:text-[#bbb]",
                        isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {r}
                        {r === "4K" && <span className="text-[9px] bg-[#FFEA00]/10 text-[#FFEA00] px-1 rounded uppercase tracking-wide font-medium">PRO</span>}
                      </span>
                      {resolution === r && !isLocked && <CheckCircle2 className="w-3 h-3 text-[#FFEA00]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format */}
            <div className="space-y-1 col-span-2">
              <LabelWithTooltip
                label="Output Format"
                tooltip="Choose the output file format."
              />
              <div className="flex items-center gap-2">
                {(["PNG", "JPEG"] as ImageFormat[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-[4px] text-xs font-medium border transition-all text-center",
                      format === f
                        ? "bg-[#232323] border-[#333] text-[#EDEDED] shadow-sm"
                        : "bg-transparent border-[#333] text-[#666] hover:text-[#888] hover:border-[#444]"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#2C2C2C] bg-[#181818] sticky bottom-0 z-10">
          <Button
            onClick={generate}
            isLoading={isGenerating}
            variant="brand"
            className="w-full h-10 text-sm font-semibold"
          >
            {!isGenerating && <Zap className="w-4 h-4 fill-black mr-2" />}
            {isGenerating ? "Generating..." : "Generate Image"}
          </Button>
        </div>
      </aside>


      {/* --- Right Panel: Gallery --- */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col relative bg-[#121212]">

        {/* Gallery Header */}
        <header className="h-14 border-b border-[#2C2C2C] flex items-center justify-between px-8 flex-shrink-0 bg-[#121212]">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#EDEDED]">Generations</span>
            <div className="h-4 w-[1px] bg-[#333]" />
            <span className="text-xs text-[#666]">Session History</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)} className="gap-2 text-xs h-8">
            <Code className="w-3.5 h-3.5" />
            View API
          </Button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {generatedImages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#444]">
              <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2C2C2C] flex items-center justify-center mb-4 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]">
                <Command className="w-6 h-6 text-[#333]" />
              </div>
              <p className="text-sm font-medium text-[#888]">No images generated yet</p>
              <p className="text-xs text-[#555] mt-1">Configure your prompt to start dreaming.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {generatedImages.map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative rounded-[4px] overflow-hidden bg-[#1A1A1A] border border-[#333] hover:border-[#555] transition-colors"
                  >
                    {/* Image */}
                    <div className="aspect-square relative bg-[#050505]">
                      <Image
                        src={img.url}
                        alt={img.prompt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="primary" className="h-8 w-8 rounded-full border-0">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="primary" className="h-8 w-8 rounded-full border-0">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 border-t border-[#2C2C2C]">
                      <p className="text-xs text-[#CCC] line-clamp-1 font-medium">{img.prompt}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-[#666] font-mono px-1.5 py-0.5 rounded border border-[#333] bg-[#121212]">{img.settings.ar}</span>
                        <span className="text-[10px] text-[#666] font-mono px-1.5 py-0.5 rounded border border-[#333] bg-[#121212]">{img.settings.res}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Code Drawer - Slide Over */}
        <AnimatePresence>
          {showCode && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowCode(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-40"
              />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute right-0 top-0 bottom-0 w-full md:w-[600px] bg-[#121212] border-l border-[#333] z-50 shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between px-6 h-14 border-b border-[#2C2C2C] bg-[#121212]">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#FFEA00]" />
                    <h2 className="text-sm font-medium text-[#EDEDED]">API Request</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowCode(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-0 bg-[#0C0C0C]">
                  <div className="p-6">
                    <pre className="font-mono text-[11px] text-[#CCC] leading-6">
                      {getCodeSnippet()}
                    </pre>
                  </div>
                </div>
                <div className="p-6 border-t border-[#2C2C2C] bg-[#181818]">
                  <Button className="w-full" variant="secondary">Copy to Clipboard</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </main>

      {/* Global Utilities */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
}
