"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const THRESHOLD_PX = 80;
const MIN_REFRESH_INTERVAL_MS = 5000;

export const PullToRefresh = () => {
  const { refresh } = useRouter();
  const startY = useRef<number | null>(null);
  const lastRefreshAt = useRef(0);
  const armed = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const isIosDevice = () => {
      if (typeof navigator === "undefined") return false;
      const platform = navigator.platform ?? "";
      const ua = navigator.userAgent ?? "";
      const isIOS = /iPad|iPhone|iPod/i.test(platform) || /iPad|iPhone|iPod/i.test(ua);
      const isIpadOS = platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1;
      return isIOS || isIpadOS;
    };

    if (!isIosDevice()) return;

    const onTouchStart = (event: TouchEvent) => {
      if (window.scrollY !== 0) {
        startY.current = null;
        armed.current = false;
        setPullDistance(0);
        return;
      }

      startY.current = event.touches[0]?.clientY ?? null;
      armed.current = true;
      setPullDistance(0);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!armed.current || startY.current === null) return;
      const currentY = event.touches[0]?.clientY ?? startY.current;
      const delta = currentY - startY.current;
      if (delta <= 0) {
        setPullDistance(0);
        return;
      }

      setPullDistance(Math.min(delta, THRESHOLD_PX + 40));
      if (delta < THRESHOLD_PX) return;

      const now = Date.now();
      if (now - lastRefreshAt.current < MIN_REFRESH_INTERVAL_MS) return;

      lastRefreshAt.current = now;
      armed.current = false;
      setIsRefreshing(true);
      setPullDistance(THRESHOLD_PX);
      refresh();
      window.setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1200);
    };

    const onTouchEnd = () => {
      startY.current = null;
      armed.current = false;
      if (!isRefreshing) {
        setPullDistance(0);
      }
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
  }, [isRefreshing, refresh]);

  const showIndicator = pullDistance > 0 || isRefreshing;
  const isReady = pullDistance >= THRESHOLD_PX && !isRefreshing;
  const label = isRefreshing ? "Refreshing..." : isReady ? "Release to refresh" : "Pull to refresh";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-50 flex justify-center">
      <div
        className={`rounded-full bg-white/90 px-3 py-1 text-xs text-gray-600 shadow-sm ring-1 ring-gray-200 transition-all ${
          showIndicator ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
      >
        {label}
      </div>
    </div>
  );
};
