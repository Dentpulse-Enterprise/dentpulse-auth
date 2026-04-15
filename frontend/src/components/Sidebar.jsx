import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Organization App Management", active: true },
  { icon: Shield, label: "Roles & Permissions" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar({ open, onClose, onLogout }) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 90,
            transition: "opacity 0.3s",
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 280,
          zIndex: 100,
          background: "linear-gradient(180deg, #1e1b4b 0%, #1a1745 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: open ? "4px 0 32px rgba(0,0,0,0.3)" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
            padding: "0 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #5b4cdb, #7c6df0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(91,76,219,0.4)",
              }}
            >
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.3px" }}>
                DentPulse Auth
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                Access Management
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              padding: 8,
              borderRadius: 8,
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              display: "flex",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "rgba(255,255,255,0.3)",
              padding: "0 12px",
              marginBottom: 12,
            }}
          >
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: item.active ? 600 : 500,
                  color: item.active ? "#fff" : "rgba(255,255,255,0.55)",
                  background: item.active
                    ? "linear-gradient(135deg, #5b4cdb, #4a3dc7)"
                    : "transparent",
                  boxShadow: item.active
                    ? "0 4px 16px rgba(91,76,219,0.35)"
                    : "none",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  marginBottom: 2,
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  }
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* User section */}
        <div
          style={{
            padding: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #5b4cdb, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(91,76,219,0.3)",
              }}
            >
              SA
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Super Admin</div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                admin@dentalcare.com
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "100%",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.45)";
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
