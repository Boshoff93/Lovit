import React from "react";
import type { Guide } from "../content/blog";

export default function GuideArtwork({
  guide,
  priority = false,
}: {
  guide: Guide;
  priority?: boolean;
}) {
  const art = guide.artwork;
  return (
    <div className={`gr-guide-art is-${guide.art}`}>
      <img
        src={priority ? art.src : art.card}
        srcSet={`${art.card} 768w, ${art.src} 1600w`}
        sizes={
          priority
            ? "(max-width: 600px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 80px), (max-width: 1115px) calc(100vw - 365px), 750px"
            : "(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) 50vw, 400px"
        }
        alt={art.alt}
        width={art.width}
        height={art.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </div>
  );
}
