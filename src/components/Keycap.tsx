// Compile shim for the label-button rename. The pages still import `Keycap`;
// the primitive now lives in LabelButton.tsx and emits btn/btn-primary. The
// pages switch to LabelButton, then this file is deleted.
export { LabelButton as Keycap, ExternalLink } from "./LabelButton";
