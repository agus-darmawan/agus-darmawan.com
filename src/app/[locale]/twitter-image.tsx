// Twitter/X uses the same card as Open Graph. Reusing the renderer keeps one
// source of truth and makes Next emit a real `twitter:image` URL per locale
// (the old hardcoded https://agus-darmawan.com/opengraph-image was a 404).
import OGImage from "./opengraph-image";

export const alt = "I Wayan Agus Darmawan — Full-Stack & Robotics Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OGImage;
