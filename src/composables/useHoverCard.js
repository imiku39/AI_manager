import { onBeforeUnmount, ref } from "vue";

export function useHoverCard(options = {}) {
  const {
    showDelay = 300,
    hideDelay = 1000,
  } = options;

  const isOpen = ref(false);
  let showTimer = null;
  let hideTimer = null;

  const clearShowTimer = () => {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
  };

  const clearHideTimer = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  };

  const open = () => {
    clearHideTimer();
    clearShowTimer();
    showTimer = setTimeout(() => {
      isOpen.value = true;
      showTimer = null;
    }, showDelay);
  };

  const close = () => {
    clearShowTimer();
    clearHideTimer();
    hideTimer = setTimeout(() => {
      isOpen.value = false;
      hideTimer = null;
    }, hideDelay);
  };

  const closeNow = () => {
    clearShowTimer();
    clearHideTimer();
    isOpen.value = false;
  };

  onBeforeUnmount(() => {
    clearShowTimer();
    clearHideTimer();
  });

  return {
    isOpen,
    open,
    close,
    closeNow,
  };
}
