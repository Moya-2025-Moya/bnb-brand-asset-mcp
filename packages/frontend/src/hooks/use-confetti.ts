"use client";

import { useCallback } from "react";

const COLORS = ["#F0B90B", "#FCD535", "#0ECB81", "#3861FB", "#FF6838", "#E040FB"];

export function useConfetti() {
  const fire = useCallback(() => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = `${6 + Math.random() * 8}px`;
      container.appendChild(piece);
    }

    setTimeout(() => {
      container.remove();
    }, 4500);
  }, []);

  return { fire };
}
