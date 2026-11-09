export function registerPageRestoreAuthCheck(
  onRestore: () => void,
  target: EventTarget = window,
): () => void {
  const handlePageShow = (event: Event) => {
    if ((event as PageTransitionEvent).persisted) onRestore();
  };

  target.addEventListener("pageshow", handlePageShow);
  return () => target.removeEventListener("pageshow", handlePageShow);
}
