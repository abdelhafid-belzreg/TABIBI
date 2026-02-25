export function Tooltip({ children, text, placement = "top" }) {
  return (
    <span
      data-bs-toggle="tooltip"
      data-bs-placement={placement}
      title={text}
    >
      {children}
    </span>
  );
}