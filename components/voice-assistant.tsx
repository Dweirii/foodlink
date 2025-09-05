"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { Camera, Phone, PhoneOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VoiceState = "idle" | "starting" | "in-call" | "listening" | "processing" | "speaking" | "ended";
type ChatRole = "user" | "assistant";
type ChatMsg = { id: string; role: ChatRole; text: string; at: number };

interface Props {
  className?: string;
  /** Salem avatar. Default: /salem.png */
  avatarSrc?: string;
  /** Primary brand color (Tailwind class). Default: emerald */
  brand?: "emerald" | "green" | "teal";
}

const PK = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;

export default function VoiceAssistantPro({
  className,
  avatarSrc = "/salem.png",
  brand = "emerald",
}: Props) {
  const vapiRef = useRef<Vapi | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  const pushMsg = useCallback((role: ChatRole, text: string) => {
    const clean = `${text ?? ""}`.trim();
    if (!clean) return;
    setChat((prev) => [...prev, { id: `${Date.now()}_${prev.length}`, role, text: clean, at: Date.now() }]);
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
      setErr(null);
    });

    vapi.on("call-end", () => {
      stopTimer();
      setVoiceState("ended");
      setTimeout(() => setVoiceState("idle"), 600);
    });

    vapi.on("speech-start", () => setVoiceState("listening"));
    vapi.on("speech-end", () => setVoiceState("processing"));

    // Defensive role/content parsing to avoid “both under أنت”
    vapi.on("message", (msg: any) => {
      // Final transcript from user
      if (msg?.type === "transcript" && (msg?.transcriptType === "final" || msg?.isFinal)) {
        pushMsg("user", msg?.transcript ?? "");
        return;
      }

      // Assistant text (Vapi can emit different shapes)
      const role = `${msg?.role ?? ""}`.toLowerCase();
      const isAssistant = role.includes("assistant");
      let content = "";

      if (typeof msg?.content === "string") content = msg.content;
      else if (Array.isArray(msg?.content)) {
        // Sometimes content is an array of segments
        content = msg.content.map((c: any) => (typeof c === "string" ? c : c?.text ?? "")).join(" ").trim();
      } else if (typeof msg?.text === "string") {
        content = msg.text;
      }

      if (isAssistant && content) {
        pushMsg("assistant", content);
        setVoiceState("speaking");
      }
    });

    vapi.on("error", (e: any) => {
      console.error("[FoodLink] Vapi error", e);
      setErr(e?.message ?? "Vapi error");
      stopTimer();
      setVoiceState("idle");
    });

    // Mic warmup (non-blocking, guarded for SSR)
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((s) => s.getTracks().forEach((t) => t.stop()))
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }

    return () => {
      stopTimer();
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
      await vapiRef.current.start(ASSISTANT_ID);
      // (Optional) seed context
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
      setVoiceState("ended");
      setTimeout(() => setVoiceState("idle"), 600);
    }
  };

  const toggleCall = async () => {
    if (voiceState === "idle" || voiceState === "ended") await startCall();
    else await endCall();
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fr = new FileReader();
    fr.onload = (ev) => {
      const url = ev.target?.result as string;
      setUploadedImage(url);

      // Send as a user message with metadata (Tool will pick it up)
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
      case "green":
        return "bg-green-600 hover:bg-green-700";
      case "teal":
        return "bg-teal-600 hover:bg-teal-700";
      default:
        return "bg-emerald-600 hover:bg-emerald-700";
    }
  }, [brand]);

  const ringCls = useMemo(() => {
    switch (voiceState) {
      case "listening":
        return "ring-2 ring-emerald-300";
      case "processing":
        return "ring-2 ring-amber-300";
      case "speaking":
        return "ring-2 ring-blue-300";
      default:
        return "ring-0";
    }
  }, [voiceState]);

  const canStart = ready && (voiceState === "idle" || voiceState === "ended");
  const canEnd = ["starting", "in-call", "listening", "processing", "speaking"].includes(voiceState);

  // ---------- Render ----------
  return (
    <Card
      className={cn(
        "mx-auto w-full max-w-md rounded-2xl border shadow-sm bg-gradient-to-b from-emerald-50 to-white",
        "md:max-w-sm", 
        className
      )}
      dir="rtl"
    >
      <CardContent className="p-0">
        <div className="bg-gradient-to-b from-emerald-50 to-white">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight">سالم — مساعد الأمن الغذائي</h2>
            <span
              className={cn(
                "text-[11px] px-2 py-1 rounded-full border",
                ready ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"
              )}
            >
              {ready ? "جاهز" : "يُحضَّر"}
            </span>
          </div>

          {/* MAIN VISUAL + TIMER */}
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "relative mx-auto h-28 w-28 rounded-full border bg-white/80 backdrop-blur shadow-sm flex items-center justify-center transition-all",
                  ringCls
                )}
              >
                <img
                  src={avatarSrc}
                  alt="Salem"
                  className="h-24 w-24 rounded-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).src = "/salem.png")}
                />
                {(voiceState === "listening" || voiceState === "processing" || voiceState === "speaking") && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full animate-[pulse_1.2s_ease-in-out_infinite]"
                    style={{ boxShadow: "0 0 0 10px rgba(16,185,129,0.08)" }}
                  />
                )}
                {voiceState === "speaking" && (
                  <div className="absolute -bottom-6 inset-x-0 flex justify-center">
                    <Volume2 className="h-5 w-5 opacity-70" aria-label="assistant speaking" />
                  </div>
                )}
              </div>

              {canEnd && (
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-600 text-white">{fmtTime(callDuration)}</span>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="px-4 pt-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
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
              <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{err}</div>
            )}
          </div>
        </div>

        {/* CHAT */}
        <div className="px-4 pb-4">
          {uploadedImage && (
            <div className="mb-3">
              <div className="relative overflow-hidden rounded-xl border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={uploadedImage} alt="Uploaded food" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          )}

          <div ref={chatRef} className="max-h-72 overflow-y-auto space-y-2 pr-1" aria-live="polite" aria-label="سجل المحادثة">
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
                      "rounded-2xl px-3 py-2 text-sm leading-relaxed max-w-[85%] border shadow-sm",
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
              <div className="text-center text-xs text-gray-500 py-6">ابدأ المكالمة للتحدث مع سالم، أو ارفع صورة لطعامك لتحليلها.</div>
            )}
          </div>

          {["listening", "processing", "speaking"].includes(voiceState) && (
            <div className="pt-1 text-center text-[12px] text-gray-500">
              {voiceState === "listening" && "أستمع إليك الآن"}
              {voiceState === "processing" && "جاري المعالجة"}
              {voiceState === "speaking" && "سالم يتحدث"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
