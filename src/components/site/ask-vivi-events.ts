export const ASK_VIVI_OPEN_EVENT = "ask-vivi:open";

/** Open the Ask VIVI panel from anywhere, optionally answering a topic first. */
export function openAskVivi(topic?: string) {
  window.dispatchEvent(new CustomEvent(ASK_VIVI_OPEN_EVENT, { detail: { topic } }));
}
