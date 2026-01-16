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
  AlertCircle
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
  variant?: "primary" | "secondary" | "ghost" | "outline" | "magic";
  size?: "default" | "sm" | "icon" | "xs";
  isLoading?: boolean;
}) => {
  const variants = {
    primary: "bg-zinc-50 text-zinc-950 hover:bg-zinc-200 shadow-sm",
    secondary: "bg-zinc-800 text-zinc-50 hover:bg-zinc-700",
    ghost: "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50",
    outline: "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-50 bg-transparent",
    magic: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 border-0 shadow-lg shadow-purple-500/20",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    xs: "h-6 px-2 text-[10px]",
    icon: "h-9 w-9 p-0 flex items-center justify-center",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
};

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
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LabelWithTooltip = ({ label, tooltip, required }: { label: string, tooltip: string, required?: boolean }) => (
  <div className="flex items-center gap-1.5 mb-2 pl-1">
    <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1">
      {label}
      {required && <span className="text-red-500/80 text-lg leading-3 h-3 block mt-1">*</span>}
    </label>
    <Tooltip content={tooltip}>
      <Info className="w-3 h-3 text-zinc-600 hover:text-zinc-400 cursor-help transition-colors" />
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
    <div className="flex h-screen w-full flex-col md:flex-row bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-zinc-800">

      {/* --- Left Sidebar: Controls --- */}
      <aside className="w-full md:w-[420px] flex-shrink-0 flex flex-col border-r border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl md:h-full overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-8 flex-1">

          {/* Header & Auth */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Zap className="w-5 h-5 text-zinc-950 fill-zinc-950" />
              </div>
              <div className="leading-tight">
                <h1 className="text-base font-bold tracking-tight text-zinc-100">Nano Banana</h1>
                <p className="text-[10px] text-zinc-500 font-medium">Gemini 3.0 Pro</p>
              </div>
            </div>

            {/* Account Toggle Mock */}
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-full border transition-all cursor-pointer select-none",
                user ? "bg-zinc-800/50 border-zinc-700" : "bg-transparent border-dashed border-zinc-700 hover:border-zinc-500"
              )}
              onClick={() => setUser(user ? null : { name: "User", isPro: true })}
            >
              {user ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[9px] font-bold">
                    DP
                  </div>
                  {user.isPro && <span className="text-[9px] font-bold bg-white text-black px-1 rounded-sm">PRO</span>}
                </>
              ) : (
                <span className="text-[10px] text-zinc-400 font-medium px-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Connect
                </span>
              )}
            </div>
          </div>

          {/* Account Status Banner */}
          <AnimatePresence>
            {user?.isPro && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-xs font-semibold text-indigo-300">Pro Account Active</h3>
                    <p className="text-[10px] text-indigo-200/60 leading-tight">You have access to 4K Ultra generation.</p>
                  </div>
                </div>
              </motion.div>
            )}
            {!user && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-3 flex items-center justify-between group cursor-pointer hover:border-yellow-500/30 transition-colors" onClick={() => setUser({ name: "User", isPro: true })}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-zinc-500 group-hover:text-yellow-500 transition-colors" />
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-200">Connect Google Account</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt */}
          <div className="space-y-1">
            <div className="flex justify-between items-end">
              <LabelWithTooltip
                label="Prompt"
                tooltip="Describe the image you want to generate in detail."
                required
              />
              <Button
                variant="magic"
                size="xs"
                className="mb-2 gap-1.5"
                onClick={enhancePrompt}
                isLoading={isEnhancing}
              >
                <Wand2 className="w-3 h-3" />
                Enhance
              </Button>
            </div>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see..."
                className="w-full min-h-[140px] rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 resize-none transition-all duration-200"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-zinc-600 font-mono">
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
              <span className="text-[10px] text-zinc-600 mb-2">{refImages.length} / 14</span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/30 rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-xs text-zinc-500 text-center">
                <span className="text-zinc-300 font-medium">Click to upload</span> or drag and drop<br />
                Supports JPG, PNG up to 14 files
              </p>
            </div>

            {/* Thumbs - Ordered Containers */}
            {refImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                <AnimatePresence>
                  {refImages.map((file, i) => (
                    <motion.div
                      key={`${file.name}-${i}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group bg-zinc-900"
                    >
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />

                      {/* Order Badge */}
                      <div className="absolute top-1 left-1 w-5 h-5 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-md text-[10px] font-mono border border-white/10 text-white shadow-sm pointer-events-none">
                        {i + 1}
                      </div>

                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-red-500/80 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
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
              <div className="grid grid-cols-3 gap-1.5 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                {["1:1", "16:9", "9:16", "4:3", "3:4"].slice(0, 3).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAr(r as AspectRatio)}
                    className={cn(
                      "text-[10px] font-medium py-1.5 rounded-md transition-all",
                      ar === r ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    )}
                  >
                    {r}
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
              <div className="flex flex-col gap-1.5">
                {(["1K", "2K", "4K"] as Resolution[]).map((r) => {
                  const isLocked = r === "4K" && !user?.isPro;
                  return (
                    <button
                      key={r}
                      onClick={() => !isLocked && setResolution(r)}
                      disabled={isLocked}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium border transition-all relative overflow-hidden",
                        resolution === r
                          ? "border-zinc-600 bg-zinc-800/80 text-zinc-100 ring-1 ring-zinc-700"
                          : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700",
                        isLocked && "opacity-50 cursor-not-allowed hover:border-zinc-800 bg-zinc-950"
                      )}
                    >
                      {r}
                      {r === "4K" && (
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wide",
                          isLocked ? "bg-zinc-800 text-zinc-500" : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        )}>PRO</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format */}
            <div className="space-y-1 col-span-2">
              <LabelWithTooltip
                label="Format"
                tooltip="Choose the output file format."
              />
              <div className="flex items-center gap-3">
                {(["PNG", "JPEG"] as ImageFormat[]).map(f => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer group">
                    <div className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                      format === f ? "border-zinc-500 bg-zinc-800" : "border-zinc-700 group-hover:border-zinc-600"
                    )}>
                      {format === f && <div className="w-2 h-2 rounded-full bg-zinc-200" />}
                    </div>
                    <span className={cn("text-xs font-medium transition-colors", format === f ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-400")}>{f}</span>
                    <input type="radio" className="hidden" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} />
                  </label>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky bottom-0 z-10">
          <Button
            onClick={generate}
            isLoading={isGenerating}
            className="w-full h-12 text-base shadow-lg shadow-zinc-900/20 bg-zinc-100 hover:bg-white text-black border-0 gap-2"
          >
            {!isGenerating && <Zap className="w-4 h-4 fill-black" />}
            {isGenerating ? "Generating..." : "Generate Image"}
          </Button>
        </div>
      </aside>


      {/* --- Right Panel: Gallery --- */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col relative bg-[#050505]">

        {/* Gallery Header */}
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">History</span>
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">{generatedImages.length}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)} className="gap-2">
            <Code className="w-3.5 h-3.5" />
            View Code
          </Button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {generatedImages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
              <div className="w-24 h-24 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-lg font-medium text-zinc-400">Ready to dream</p>
              <p className="text-sm">Configure settings and generate your first image.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {generatedImages.map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
                  >
                    {/* Image */}
                    <div className="aspect-square relative bg-zinc-950">
                      <Image
                        src={img.url}
                        alt={img.prompt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                        <div className="flex gap-2">
                          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white text-white hover:text-black">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white text-white hover:text-black">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed font-light">{img.prompt}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900">{img.settings.ar}</span>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900">{img.settings.res}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Code Drawer / Drawer Overlay */}
        <AnimatePresence>
          {showCode && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowCode(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 bottom-0 w-full md:w-[500px] bg-zinc-950 border-l border-zinc-800 z-50 shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-zinc-900">
                  <h2 className="text-lg font-medium">API Request</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowCode(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-6 bg-[#0B0B0C]">
                  <pre className="font-mono text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">
                    {getCodeSnippet()}
                  </pre>
                </div>
                <div className="p-6 border-t border-zinc-900 bg-zinc-900/50">
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
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
