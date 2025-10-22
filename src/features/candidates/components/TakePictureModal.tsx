/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

type Step = 1 | 2 | 3;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (dataUrl: string) => void;
  title?: string;
};

const ROI = { x: 0.08, y: 0.18, w: 0.28, h: 0.42 };
const HOLD_OK_FRAMES = 10;

export default function TakePictureModal({
  open,
  onClose,
  onSubmit,
  title = "Raise Your Hand to Capture",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const [step, setStep] = useState<Step>(1);
  const [okCounter, setOkCounter] = useState(0);
  const [poseOk, setPoseOk] = useState(false);
  const [poseMsg, setPoseMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      setCaptured(null);
      setCountdown(null);
      setStep(1);
      setOkCounter(0);
      setPoseOk(false);
      setPoseMsg(null);

      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;

          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.muted = true;
          await videoRef.current.play().catch(() => {});
        }

        const [{ Hands }, { Camera }] = await Promise.all([
          import("@mediapipe/hands"),
          import("@mediapipe/camera_utils"),
        ]);

        const hands = new Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        hands.onResults((results: any) => {
          const lm = results.multiHandLandmarks?.[0] as
            | { x: number; y: number; z: number }[]
            | undefined;

          if (!lm) {
            setPoseOk(false);
            setPoseMsg("Hand not detected");
            setOkCounter(0);
            return;
          }

          const ok = matchPose(step, lm);
          setPoseOk(ok);
          setPoseMsg(
            ok ? null : "Pose not detected. Keep your hand in the box.",
          );

          setOkCounter((c) => {
            const next = ok ? c + 1 : 0;
            if (next >= HOLD_OK_FRAMES) {
              if (step < 3) {
                setStep((s) => (s + 1) as Step);
                return 0;
              } else if (step === 3 && countdown === null && !captured) {
                setCountdown(3);
              }
            }
            return next;
          });
        });

        handsRef.current = hands;

        if (videoRef.current) {
          const cam = new Camera(videoRef.current, {
            onFrame: async () => {
              if (!handsRef.current || cancelled) return;
              await handsRef.current.send({ image: videoRef.current });
            },
            width: 1280,
            height: 720,
          });
          cameraRef.current = cam;
          cam.start();
        }
      } catch {
        setPoseMsg("Cannot access camera.");
      }
    }

    function stop() {
      try {
        cameraRef.current?.stop?.();
      } catch {}
      cameraRef.current = null;
      handsRef.current = null;

      const s = streamRef.current;
      if (s) {
        s.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }

    if (open) start();
    else stop();

    return () => {
      cancelled = true;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      capture();
      setCountdown(null);
      return;
    }
    const t = window.setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);

  function capture() {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const data = canvas.toDataURL("image/jpeg", 0.92);
    setCaptured(data);
  }

  function handleRetake() {
    setCaptured(null);
    setStep(1);
    setCountdown(null);
    setOkCounter(0);
    setPoseOk(false);
    setPoseMsg(null);
  }

  function handleSubmit() {
    if (!captured) return;
    onSubmit(captured);
    onClose();
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  if (!open) return null;

  const boxColor =
    countdown !== null
      ? "border-yellow-400"
      : poseOk
      ? "border-emerald-500"
      : "border-red-500";

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-500">
                Follow the pose sequence. We’ll capture on the final pose.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-auto px-6 py-5">
            <div className="relative overflow-hidden rounded-xl border bg-black/5">
              {!captured ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="block h-[420px] w-full bg-black/30 object-cover"
                />
              ) : (
                <Image
                  src={captured}
                  alt="Captured"
                  width={1280}
                  height={720}
                  className="block h-[420px] w-full object-cover"
                />
              )}

              {!captured && (
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className={`absolute ${boxColor} border-4`}
                    style={{
                      left: `${ROI.x * 100}%`,
                      top: `${ROI.y * 100}%`,
                      width: `${ROI.w * 100}%`,
                      height: `${ROI.h * 100}%`,
                    }}
                  />
                  <div className="absolute left-[8%] top-[10%] rounded bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                    Pose {step}
                  </div>
                  {!poseOk && poseMsg && (
                    <div className="absolute right-[6%] top-[10%] rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
                      Undetected
                    </div>
                  )}
                </div>
              )}

              {countdown !== null && !captured && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="text-center">
                    <p className="mb-2 text-white">Capturing photo in</p>
                    <div className="text-6xl font-bold text-white">
                      {countdown}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              {!captured ? (
                <div className="text-sm">
                  <p className="mb-3 text-gray-700">
                    Step {step}/3 — keep your hand inside the green box and
                    match the pose icon.
                  </p>
                  <PoseRow step={step} />
                  {poseMsg && (
                    <p className="mt-3 text-center text-xs text-red-600">
                      {poseMsg}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Retake photo
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-md bg-[#01959F] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>

          <canvas ref={captureCanvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}

function fingerUp(lm: any[], tip: number, pip: number) {
  return lm[tip].y < lm[pip].y;
}
function fingerDown(lm: any[], tip: number, pip: number) {
  return lm[tip].y >= lm[pip].y;
}
function pose1_indexUp(lm: any[]) {
  const indexUp = fingerUp(lm, 8, 6);
  const middleDown = fingerDown(lm, 12, 10);
  const ringDown = fingerDown(lm, 16, 14);
  const pinkyDown = fingerDown(lm, 20, 18);
  return indexUp && middleDown && ringDown && pinkyDown;
}
function pose2_victory(lm: any[]) {
  const indexUp = fingerUp(lm, 8, 6);
  const middleUp = fingerUp(lm, 12, 10);
  const ringDown = fingerDown(lm, 16, 14);
  const pinkyDown = fingerDown(lm, 20, 18);
  return indexUp && middleUp && ringDown && pinkyDown;
}
function pose3_rockOn(lm: any[]) {
  const indexUp = fingerUp(lm, 8, 6);
  const middleDown = fingerDown(lm, 12, 10);
  const ringDown = fingerDown(lm, 16, 14);
  const pinkyUp = fingerUp(lm, 20, 18);
  return indexUp && middleDown && ringDown && pinkyUp;
}
function matchPose(step: Step, lm: any[]) {
  if (step === 1) return pose1_indexUp(lm);
  if (step === 2) return pose2_victory(lm);
  return pose3_rockOn(lm);
}

function PoseRow({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <PoseIcon n={1} active={step === 1} />
      <Arrow />
      <PoseIcon n={2} active={step === 2} />
      <Arrow />
      <PoseIcon n={3} active={step === 3} />
    </div>
  );
}
function PoseIcon({ n, active }: { n: 1 | 2 | 3; active?: boolean }) {
  const poseImage = { 1: "/v1.png", 2: "/v2.png", 3: "/v3.png" }[n];
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-md border bg-amber-50 text-xl ${
        active ? "ring-2 ring-emerald-500" : ""
      }`}
      aria-label={`Pose ${n}${active ? " (active)" : ""}`}
      title={`Pose ${n}`}
    >
      <Image
        src={poseImage}
        alt={`Pose ${n}`}
        width={32}
        height={46}
        className="h-10 w-8"
      />
    </div>
  );
}
function Arrow() {
  return (
    <span aria-hidden className="text-gray-400">
      ›
    </span>
  );
}
