export const getMousePos = (e) => {
  const bounds = e.target.getBoundingClientRect();
  const x = e.clientX - bounds.left;
  const y = e.clientY - bounds.top;
  return { x, y };
};
