import Toggle from "./Toggle";
import { Activity, BookOpen, TrendingUp, UserSearch } from "lucide-react";

const permissionConfig = [
  { key: "dentpulse", label: "DentPulse Enterprise", icon: Activity, color: "#5b4cdb", dotColor: "#5b4cdb" },
  { key: "dentledger", label: "DentLedger", icon: BookOpen, color: "#22b573", dotColor: "#22b573" },
  { key: "dentscale", label: "DentScale", icon: TrendingUp, color: "#f0a830", dotColor: "#f0a830" },
];

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const avatarGradients = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #22b573, #0ea5e9)",
  "linear-gradient(135deg, #f97316, #ef4444)",
  "linear-gradient(135deg, #ec4899, #a855f7)",
  "linear-gradient(135deg, #3b82f6, #2dd4bf)",
  "linear-gradient(135deg, #8b5cf6, #d946ef)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #5b4cdb, #a78bfa)",
];

function getAvatarGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

export default function UserTable({ users, onTogglePermission }) {
  if (users.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid var(--border)",
          padding: "64px 24px",
          textAlign: "center",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "var(--bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <UserSearch size={28} color="var(--text-muted)" />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
          No users found
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
          Try adjusting your search or filter criteria
        </div>
      </div>
    );
  }

  const tableCard = {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid var(--border)",
    overflow: "hidden",
    boxShadow: "var(--shadow-card)",
  };

  const thStyle = {
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    padding: "14px 20px",
    background: "#f8f9fc",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "16px 20px",
    borderBottom: "1px solid var(--border-light)",
    verticalAlign: "middle",
  };

  return (
    <>
      {/* Desktop */}
      <div style={tableCard} className="hidden lg:block">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Organization</th>
              {permissionConfig.map((p) => (
                <th key={p.key} style={{ ...thStyle, textAlign: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: p.dotColor,
                        display: "inline-block",
                      }}
                    />
                    {p.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => {
              return (
                <tr
                  key={user.id}
                  style={{
                    transition: "background 0.15s",
                    animation: `fadeIn 0.35s ease-out ${i * 0.04}s both`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f9fc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: getAvatarGradient(user.name),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                        }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--text)",
                            lineHeight: "1.3",
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-secondary)",
                            marginTop: 2,
                          }}
                        >
                          {user.email}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginTop: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#5b4cdb", display: "inline-block" }} />
                          {user.clinic}
                        </div>
                      </div>
                    </div>
                  </td>
                  {permissionConfig.map((perm) => (
                    <td key={perm.key} style={{ ...tdStyle, textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Toggle
                          enabled={user.permissions[perm.key]}
                          onToggle={() => onTogglePermission(user.id, perm.key)}
                          label={`${perm.label} access for ${user.name}`}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tablet */}
      <div className="hidden sm:block lg:hidden" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {users.map((user, i) => {
          return (
            <div
              key={user.id}
              className="hidden sm:block lg:hidden"
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: 20,
                boxShadow: "var(--shadow-card)",
                animation: `fadeIn 0.35s ease-out ${i * 0.05}s both`,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-card)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: getAvatarGradient(user.name),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  {getInitials(user.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                    {user.email}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#5b4cdb", display: "inline-block" }} />
                    {user.clinic}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  paddingTop: 14,
                  borderTop: "1px solid var(--border-light)",
                }}
              >
                {permissionConfig.map((perm) => {
                  const Icon = perm.icon;
                  return (
                    <div key={perm.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon size={15} color={perm.color} />
                      <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                        {perm.label}
                      </span>
                      <Toggle
                        enabled={user.permissions[perm.key]}
                        onToggle={() => onTogglePermission(user.id, perm.key)}
                        label={`${perm.label} access for ${user.name}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="sm:hidden" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {users.map((user, i) => {
          return (
            <div
              key={user.id}
              className="sm:hidden"
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: 16,
                boxShadow: "var(--shadow-card)",
                animation: `fadeIn 0.35s ease-out ${i * 0.05}s both`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: getAvatarGradient(user.name),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  }}
                >
                  {getInitials(user.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 1 }}>
                    {user.email}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#5b4cdb", display: "inline-block" }} />
                    {user.clinic}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  paddingTop: 12,
                  borderTop: "1px solid var(--border-light)",
                }}
              >
                {permissionConfig.map((perm) => {
                  const Icon = perm.icon;
                  return (
                    <div
                      key={perm.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Icon size={16} color={perm.color} />
                        <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                          {perm.label}
                        </span>
                      </div>
                      <Toggle
                        enabled={user.permissions[perm.key]}
                        onToggle={() => onTogglePermission(user.id, perm.key)}
                        label={`${perm.label} access for ${user.name}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
