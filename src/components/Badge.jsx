export default function Badge({ text, color, bg }) {
  return (
    <span style={{
      background: bg,
      color,
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600
    }}>
      {text}
    </span>
  );
}