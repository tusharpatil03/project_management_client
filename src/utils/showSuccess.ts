export const showSuccess = (message: string) => {
  const event = new CustomEvent('show-success', {
    detail: { message }
  });
  window.dispatchEvent(event);
};