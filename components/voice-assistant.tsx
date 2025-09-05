"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { Camera, Loader2, Phone, PhoneOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VoiceState = "idle" | "starting" | "in-call" | "listening" | "processing" | "speaking" | "ended";
type ChatMsg = { id: string; role: "user" | "assistant"; text: string; at: number };

interface Props {
  className?: string;
  /** Salem avatar. Default: /salem.png */
  avatarSrc?: string;
  /** Primary brand color (Tailwind class). Default: emerald */
  brand?: "emerald" | "green" | "teal";
}

const PK = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;

// If UI sits in processing too long, auto-recover to "in-call"
const WATCHDOG_MS = 7000;

export default function VoiceAssistantPro({
  className,
  avatarSrc = "/salem.png",
  brand = "emerald",
}: Props) {
  const vapiRef = useRef<Vapi | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const watchdogRef = useRef<NodeJS.Timeout | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatMsg[]>([]);

  // ---------- utilities ----------
  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startTimer = () => {
    setCallDuration(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCallDuration((x) => x + 1), 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const armWatchdog = () => {
    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    watchdogRef.current = setTimeout(() => setVoiceState("in-call"), WATCHDOG_MS);
  };
  const clearWatchdog = () => {
    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    watchdogRef.current = null;
  };

  const pushMsg = useCallback((role: "user" | "assistant", text: string) => {
    if (!text?.trim()) return;
    setChat((prev) => [...prev, { id: `${Date.now()}_${prev.length}`, role, text, at: Date.now() }]);
  }, []);

  useEffect(() => {
    // auto-scroll to last message
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.length]);

  // ---------- init Vapi ----------
  useEffect(() => {
    if (!PK || !ASSISTANT_ID) {
      setErr("Environment is missing Vapi keys. Set NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID.");
      return;
    }

    const vapi = new Vapi(PK);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setVoiceState("in-call");
      startTimer();
    });

    vapi.on("call-end", () => {
      stopTimer();
      clearWatchdog();
      setVoiceState("ended");
      setTimeout(() => setVoiceState("idle"), 700);
    });

    vapi.on("speech-start", () => {
      setVoiceState("listening");
      clearWatchdog();
    });

    vapi.on("speech-end", () => {
      setVoiceState("processing");
      armWatchdog();
    });

    vapi.on("message", (msg: any) => {
      // user final transcript
      if (msg?.type === "transcript" && msg?.transcriptType === "final") {
        pushMsg("user", msg.transcript);
      }
      // assistant spoken text
      if (msg?.type === "response" && msg?.role === "assistant" && typeof msg?.content === "string") {
        pushMsg("assistant", msg.content);
        setVoiceState("speaking");
        clearWatchdog();
      }
    });

    vapi.on("error", (e: any) => {
      console.error("[FoodLink] Vapi error", e);
      setErr(e?.message ?? "Vapi error");
      stopTimer();
      clearWatchdog();
      setVoiceState("idle");
    });

    // mic warmup (non-blocking)
    navigator.mediaDevices
      ?.getUserMedia?.({ audio: true })
      .then((s) => s.getTracks().forEach((t) => t.stop()))
      .finally(() => setReady(true));

    return () => {
      stopTimer();
      clearWatchdog();
      vapi.removeAllListeners?.();
      vapiRef.current = null;
    };
  }, [pushMsg]);

  // ---------- actions ----------
  const startCall = async () => {
    if (!vapiRef.current) return;
    setErr(null);
    setChat([]);
    setVoiceState("starting");
    try {
      // NOTE: no 'variables' here — AssistantOverrides does not include it.
      await vapiRef.current.start(ASSISTANT_ID);
      // Optionally, send a "context" message after start:
      vapiRef.current.send?.({
        type: "add-message",
        message: {
          role: "user",
          content: "ابدأ المكالمة. اسمي المستخدم من تطبيق FoodLink.",
          metadata: { client: "foodlink-web", env: process.env.NODE_ENV },
        },
      });
    } catch (e: any) {
      setErr(e?.message ?? "Failed to start");
      setVoiceState("idle");
    }
  };

  const endCall = async () => {
    try {
      await vapiRef.current?.stop();
    } finally {
      stopTimer();
      clearWatchdog();
      setVoiceState("ended");
      setTimeout(() => setVoiceState("idle"), 600);
    }
  };

  const toggleCall = async () => {
    if (["idle", "ended"].includes(voiceState)) await startCall();
    else await endCall(); // ALWAYS allow end — even while processing/starting
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fr = new FileReader();
    fr.onload = (ev) => {
      const url = ev.target?.result as string;
      setUploadedImage(url);

      // Supported way: add a user message with metadata that your Tool can read.
      vapiRef.current?.send?.({
        type: "add-message",
        message: {
          role: "user",
          content: "حلّل الصورة المرفقة.",
          metadata: { imageDataUrl: url, intent: "analyze_food_image" },
        },
      });

      pushMsg("user", "قمت برفع صورة للطعام.");
    };
    fr.readAsDataURL(file);
  };

  // ---------- UI helpers ----------
  const brandBg = useMemo(() => {
    switch (brand) {
      case "green": return "bg-green-600 hover:bg-green-700";
      case "teal": return "bg-teal-600 hover:bg-teal-700";
      default: return "bg-emerald-600 hover:bg-emerald-700";
    }
  }, [brand]);

  const ringColor = useMemo(() => {
    switch (brand) {
      case "green": return "ring-green-300";
      case "teal": return "ring-teal-300";
      default: return "ring-emerald-300";
    }
  }, [brand]);

  const PrimaryStateVisual = useMemo(() => {
    const speaking = voiceState === "speaking";
    const processing = voiceState === "processing" || voiceState === "starting";

    return (
      <div
        className={cn(
          "relative mx-auto h-28 w-28 rounded-full border bg-white/80 backdrop-blur shadow-md flex items-center justify-center transition-all",
          voiceState === "listening" && ringColor,
          voiceState === "listening" && "ring-2",
          processing && "ring-2 ring-amber-300",
          speaking && "ring-2 ring-blue-300"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {!processing && !speaking && (
          <img
            src={avatarSrc}
            alt="Salem"
            className="h-24 w-24 rounded-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).src = "/salem.png")}
          />
        )}
        {processing && <Loader2 className="h-9 w-9 animate-spin text-gray-700" aria-label="processing" />}
        {speaking && <Volume2 className="h-9 w-9 animate-pulse text-gray-800" aria-label="assistant speaking" />}

        {/* gentle halo */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full",
            voiceState === "listening" && "animate-pulse",
            processing && "animate-[pulse_1.2s_ease-in-out_infinite]",
            speaking && "animate-[pulse_1.2s_ease-in-out_infinite]"
          )}
          style={{ boxShadow: "0 0 0 10px rgba(16,185,129,0.08)" }}
        />
      </div>
    );
  }, [avatarSrc, ringColor, voiceState]);

  const canStart = ready && (voiceState === "idle" || voiceState === "ended");
  const canEnd = ["starting", "in-call", "listening", "processing", "speaking"].includes(voiceState);

  return (
    <Card
      className={cn("overflow-hidden rounded-2xl border shadow-sm bg-gradient-to-b from-emerald-50 to-white backdrop-blur", className)}
      dir="rtl"
    >
      <CardContent className="p-0">
        {/* HEADER */}
        <div className="bg-gradient-to-b from-emerald-50 to-white">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-xl font-extrabold tracking-tight pb-4">سالم — مساعد الأمن الغذائي</h2>
            </div>
            <div
              className={cn(
                "text-xs px-2 py-1 rounded-full border mb-4",
                ready ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"
              )}
            >
              {ready ? "جاهز " : "يُحضَّر"}
            </div>
          </div>

          {/* MAIN VISUAL + TIMER */}
          <div className="px-5">
            <div className="flex items-center justify-between">
              {PrimaryStateVisual}
              {canEnd && (
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-600 text-white">
                  {fmtTime(callDuration)}
                </span>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="px-5 pt-4 pb-5">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={toggleCall}
                className={cn("w-full font-semibold text-white", canStart ? brandBg : "bg-rose-600 hover:bg-rose-700")}
                aria-label={canStart ? "اتصل بسالم" : "إنهاء المكالمة"}
              >
                {canStart ? <Phone className="w-5 h-5 ms-1" /> : <PhoneOff className="w-5 h-5 ms-1" />}
                {canStart ? "اتصل بسالم" : "إنهاء المكالمة"}
              </Button>

              <Button
                variant="outline"
                onClick={() => document.getElementById("food-image-input")?.dispatchEvent(new MouseEvent("click"))}
                className="w-full"
              >
                <Camera className="w-5 h-5 ms-1" />
                ارفع صورة للطعام
              </Button>
              <input id="food-image-input" type="file" accept="image/*" onChange={onUpload} className="hidden" />
            </div>

            {err && (
              <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {err}
              </div>
            )}
          </div>
        </div>

        {/* CHAT */}
        <div className="px-5 pb-5">
          {uploadedImage && (
            <div className="mb-3">
              <div className="relative overflow-hidden rounded-xl border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={uploadedImage} alt="Uploaded food" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          )}

          <div
            ref={chatRef}
            className="max-h-72 overflow-y-auto space-y-2 pr-1"
            aria-live="polite"
            aria-label="سجل المحادثة"
          >
            {chat.map((m) => {
              const mine = m.role === "user";
              return (
                <div key={m.id} className={cn("flex items-start gap-2", mine ? "justify-end" : "justify-start")}>
                  {!mine && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarSrc} alt="سالم" className="mt-0.5 h-6 w-6 rounded-full object-cover" />
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-3 py-2 text-sm leading-relaxed max-w-[80%] border shadow-sm",
                      mine ? "bg-white border-gray-200" : "bg-emerald-50 border-emerald-200"
                    )}
                  >
                    <div className="font-bold mb-0.5">{mine ? "أنت" : "سالم"}</div>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                  {mine && <div className="invisible h-6 w-6" />}
                </div>
              );
            })}
            {chat.length === 0 && (
              <div className="text-center text-xs text-gray-500 py-6">
                ابدأ المكالمة للتحدث مع سالم، أو ارفع صورة لطعامك لتحليلها.
              </div>
            )}
          </div>

          {["listening", "processing", "speaking"].includes(voiceState) && (
            <div className="pt-2 text-center text-xs text-gray-500">
              {voiceState === "listening" && " أستمع إليك الآن"}
              {voiceState === "processing" && " جاري المعالجة"}
              {voiceState === "speaking" && " سالم يتحدث"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
