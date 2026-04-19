export default function Badge({ text, color, bg }) {
  return (
    <span style={{
      background: bg,
      color: color,
      fontSize: 11,
      fontWeight: 600,
      padding: '3px 10px',
      borderRadius: 20,
      letterSpacing: 0.2,
      whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>
      {text}
    </span>
  );
}
