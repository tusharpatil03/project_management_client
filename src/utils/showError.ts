export const showError = (message: string) => {
  const event = new CustomEvent('show-error', {
    detail: { message }
  });
  window.dispatchEvent(event);
};