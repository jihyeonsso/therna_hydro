"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [status, setStatus] = useState<"starting" | "scanning" | "denied" | "unsupported">("starting");

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("scanning");
        tick();
      } catch {
        setStatus("denied");
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            // TODO: 실제 제품코드 형식 검증 필요 (QR 규격 미확정 — 자료요청서 1항).
            // 현재는 단일 제품(ThermaVita Hydro)이라 QR 인식 성공 = 제품 정보로 이동.
            stopCamera();
            router.push("/product");
            return;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    start();
    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopCamera() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#0F1512]">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4">
        <button
          onClick={() => {
            stopCamera();
            router.back();
          }}
          aria-label="뒤로가기"
          className="text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="text-base font-bold text-white">QR 스캔</div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <div className="relative h-[260px] w-[260px] overflow-hidden rounded-2xl bg-[#1A211D]">
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="pointer-events-none absolute left-0 top-0 h-9 w-9 rounded-tl-xl border-l-4 border-t-4 border-[#6FCF97]" />
          <div className="pointer-events-none absolute right-0 top-0 h-9 w-9 rounded-tr-xl border-r-4 border-t-4 border-[#6FCF97]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-9 w-9 rounded-bl-xl border-b-4 border-l-4 border-[#6FCF97]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-9 w-9 rounded-br-xl border-b-4 border-r-4 border-[#6FCF97]" />
        </div>

        <div className="text-center text-sm leading-relaxed text-[#D8E3DA]">
          {status === "starting" && "카메라를 준비하고 있어요..."}
          {status === "scanning" && (
            <>
              제품에 표기된 QR코드를
              <br />
              사각형 안에 비춰주세요
            </>
          )}
          {status === "denied" && (
            <>
              카메라 권한이 필요합니다.
              <br />
              브라우저 설정에서 카메라 접근을 허용해주세요.
            </>
          )}
          {status === "unsupported" && "이 브라우저는 카메라 스캔을 지원하지 않습니다."}
        </div>

        <Link
          href="/product/code"
          className="flex h-[46px] items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white"
        >
          코드 직접 입력으로 전환
        </Link>
      </div>
    </div>
  );
}
