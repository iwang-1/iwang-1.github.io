import { flags, liveDemoUrl, screenshot } from "../content";

export default function Screenshot() {
  return (
    <figure className="screenshot">
      <img
        src={screenshot.src}
        width={screenshot.width}
        height={screenshot.height}
        loading="lazy"
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
