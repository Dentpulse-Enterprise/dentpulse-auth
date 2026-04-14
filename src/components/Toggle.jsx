export default function Toggle({ enabled, onToggle, label }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      style={{
        position: "relative",
        display: "inline-flex",
        height: 26,
        width: 48,
        flexShrink: 0,
        cursor: "pointer",
        borderRadius: 26,
        border: "none",
        padding: 0,
        background: enabled
          ? "linear-gradient(135deg, #5b4cdb, #7c6df0)"
          : "#d8dce8",
        boxShadow: enabled
          ? "0 2px 8px rgba(91,76,219,0.3), inset 0 1px 2px rgba(0,0,0,0.1)"
          : "inset 0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        outline: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = enabled
          ? "0 2px 8px rgba(91,76,219,0.3), 0 0 0 3px rgba(91,76,219,0.15)"
          : "inset 0 1px 3px rgba(0,0,0,0.1), 0 0 0 3px rgba(91,76,219,0.15)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = enabled
          ? "0 2px 8px rgba(91,76,219,0.3), inset 0 1px 2px rgba(0,0,0,0.1)"
          : "inset 0 1px 3px rgba(0,0,0,0.1)";
      }}
    >
      <span
        style={{
          display: "block",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          transform: enabled ? "translateX(24px)" : "translateX(2px)",
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          marginTop: 2,
        }}
      />
    </button>
  );
}
