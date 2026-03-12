"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const THRESHOLD_PX = 80;
const MIN_REFRESH_INTERVAL_MS = 5000;

export const PullToRefresh = () => {
  const { refresh } = useRouter();
  const startY = useRef<number | null>(null);
  const lastRefreshAt = useRef(0);
  const armed = useRef(false);

  useEffect(() => {
    const isIosDevice = () => {
      if (typeof navigator === "undefined") return false;
      const platform = navigator.platform ?? "";
      const ua = navigator.userAgent ?? "";
      const isIOS = /iPad|iPhone|iPod/i.test(platform) || /iPad|iPhone|iPod/i.test(ua);
      const isIpadOS = platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1;
      return isIOS || isIpadOS;
    };

    const isStandalone = () => {
      if (typeof window === "undefined") return false;
      return (
        window.matchMedia?.("(display-mode: standalone)")?.matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      );
    };

    if (!isIosDevice() || !isStandalone()) return;

    const onTouchStart = (event: TouchEvent) => {
      if (window.scrollY !== 0) {
        startY.current = null;
        armed.current = false;
        return;
      }

      startY.current = event.touches[0]?.clientY ?? null;
      armed.current = true;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!armed.current || startY.current === null) return;
      const currentY = event.touches[0]?.clientY ?? startY.current;
      const delta = currentY - startY.current;
      if (delta < THRESHOLD_PX) return;

      const now = Date.now();
      if (now - lastRefreshAt.current < MIN_REFRESH_INTERVAL_MS) return;

      lastRefreshAt.current = now;
      armed.current = false;
      refresh();
    };

    const onTouchEnd = () => {
      startY.current = null;
      armed.current = false;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [refresh]);

  return null;
};
