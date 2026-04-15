import { Search, Bell, Menu, ChevronRight } from "lucide-react";

export default function TopBar({ searchQuery, onSearchChange, onOpenSidebar }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        height: 64,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "0 24px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onOpenSidebar}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              cursor: "pointer",
              color: "var(--text-secondary)",
              boxShadow: "var(--shadow-sm)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <Menu size={18} />
          </button>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
            className="hidden sm:flex"
          >
            <span style={{ color: "var(--text-muted)" }}>Admin</span>
            <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
            <span style={{ color: "var(--text)", fontWeight: 600 }}>
              Organization App Management
            </span>
          </nav>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: 240,
                height: 40,
                paddingLeft: 38,
                paddingRight: 14,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                fontSize: 13,
                color: "var(--text)",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
                e.target.style.boxShadow = "0 0 0 3px var(--primary-glow)";
                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
                e.target.style.background = "var(--bg)";
              }}
            />
          </div>
          <button
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              cursor: "pointer",
              color: "var(--text-secondary)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--danger)",
                border: "2px solid #fff",
              }}
            />
          </button>
          <div
            className="hidden sm:flex"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #5b4cdb, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(91,76,219,0.25)",
            }}
          >
            SA
          </div>
        </div>
      </div>
    </header>
  );
}
