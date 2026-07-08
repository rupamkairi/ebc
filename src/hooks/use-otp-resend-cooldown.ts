"use client";

import { useCallback, useEffect, useState } from "react";

const DEFAULT_COOLDOWN_SECONDS = 60;

const readExpiry = (storageKey: string) => {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem(storageKey);
  const expiry = raw ? Number(raw) : 0;
  return Number.isFinite(expiry) ? expiry : 0;
};

const formatSeconds = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${String(remainingSeconds).padStart(2, "0")}s`;
};

export function useOtpResendCooldown(
  storageKey: string | null,
  cooldownSeconds = DEFAULT_COOLDOWN_SECONDS,
) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") {
      setRemainingSeconds(0);
      return;
    }

    const syncCooldown = () => {
      const expiry = readExpiry(storageKey);
      const nextRemaining = Math.max(
        0,
        Math.ceil((expiry - Date.now()) / 1000),
      );

      setRemainingSeconds(nextRemaining);

      if (nextRemaining <= 0) {
        window.localStorage.removeItem(storageKey);
      }
    };

    syncCooldown();
    const interval = window.setInterval(syncCooldown, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [storageKey]);

  const startCooldown = useCallback(() => {
    if (!storageKey || typeof window === "undefined") {
      return;
    }

    const expiry = Date.now() + cooldownSeconds * 1000;
    window.localStorage.setItem(storageKey, String(expiry));
    setRemainingSeconds(cooldownSeconds);
  }, [cooldownSeconds, storageKey]);

  const clearCooldown = useCallback(() => {
    if (!storageKey || typeof window === "undefined") {
      setRemainingSeconds(0);
      return;
    }

    window.localStorage.removeItem(storageKey);
    setRemainingSeconds(0);
  }, [storageKey]);

  return {
    clearCooldown,
    formatSeconds,
    isCoolingDown: remainingSeconds > 0,
    remainingSeconds,
    startCooldown,
  };
}
