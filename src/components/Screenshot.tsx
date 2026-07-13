import { flags, liveDemoUrl, screenshot } from "../content";

export default function Screenshot() {
  return (
    <figure className="screenshot">
      {/* No loading="lazy": this is the page's only large image and its likely
          LCP element — let the preload scanner fetch it eagerly. */}
      <img
        src={screenshot.src}
        width={screenshot.width}
        height={screenshot.height}
        alt={screenshot.alt}
      />
      <figcaption>
        {screenshot.caption}
        {flags.showLiveDemo && (
          <>
            {" "}
            <a href={liveDemoUrl}>
              Live demo<span aria-hidden="true"> ↗</span>
            </a>
          </>
        )}
      </figcaption>
    </figure>
  );
}
