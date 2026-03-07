"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const MIN_REFRESH_INTERVAL_MS = 5000;

export const AutoRefreshOnRevisit = () => {
  const { refresh } = useRouter();
  const lastRefreshAt = useRef(0);

  useEffect(() => {
    const triggerRefresh = () => {
      const now = Date.now();
      if (now - lastRefreshAt.current < MIN_REFRESH_INTERVAL_MS) {
        return;
      }
      lastRefreshAt.current = now;
      refresh();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        triggerRefresh();
      }
    };

    window.addEventListener("focus", triggerRefresh);
    window.addEventListener("pageshow", triggerRefresh);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", triggerRefresh);
      window.removeEventListener("pageshow", triggerRefresh);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh]);

  return null;
};
