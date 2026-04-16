import { useState } from "react";
import Toggle from "./Toggle";
import {
  Activity,
  BookOpen,
  TrendingUp,
  UserSearch,
  ChevronRight,
  ChevronDown,
  Building2,
  Crown,
  User,
} from "lucide-react";

const permissionConfig = [
  { key: "dentpulse", label: "DentPulse Enterprise", icon: Activity, color: "#5b4cdb", dotColor: "#5b4cdb" },
  { key: "dentledger", label: "DentLedger", icon: BookOpen, color: "#22b573", dotColor: "#22b573" },
  { key: "dentscale", label: "DentScale", icon: TrendingUp, color: "#f0a830", dotColor: "#f0a830" },
];

function getInitials(name) {
  if (!name) return "?";
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
  for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

function PersonRow({ person, isOwner, orgId, onTogglePermission, indent }) {
  const displayName = person.full_name || "Unknown";
  const userId = person.user_id || person.id;
  const RoleIcon = isOwner ? Crown : User;
  const roleColor = isOwner ? "#5b4cdb" : "#22b573";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: indent ? "10px 20px 10px 56px" : "10px 20px",
        borderBottom: "1px solid var(--border-light, #f0f0f0)",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f9fc")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Status dot */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: roleColor,
          flexShrink: 0,
        }}
      />

      {/* Avatar */}
      {person.avatar_url ? (
        <img
          src={person.avatar_url}
          alt={displayName}
          style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
        />
      ) : (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: getAvatarGradient(displayName),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {getInitials(displayName)}
        </div>
      )}

      {/* Name + email */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontSize: 9,
              fontWeight: 700,
              color: roleColor,
              background: `${roleColor}12`,
              padding: "1px 6px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              flexShrink: 0,
            }}
          >
            <RoleIcon size={9} />
            {isOwner ? "Owner" : "Member"}
          </span>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            marginTop: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {person.email}
        </div>
      </div>

      {/* Toggles */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        {permissionConfig.map((perm) => (
          <div key={perm.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: perm.dotColor,
                display: "inline-block",
              }}
            />
            <Toggle
              enabled={person.permissions?.[perm.key] ?? false}
              onToggle={() => onTogglePermission(userId, perm.key, orgId)}
              label={`${perm.label} for ${displayName}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgCard({ item, onTogglePermission }) {
  const [expanded, setExpanded] = useState(false);
  const { organization, owners, members } = item;
  const orgName = organization?.name || "Unknown Organization";
  const orgId = organization?.id;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Org Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          cursor: "pointer",
          background: expanded ? "#f8f9fc" : "#fff",
          borderBottom: expanded ? "1px solid var(--border)" : "none",
          transition: "background 0.15s",
          userSelect: "none",
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
          }}
        >
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>

        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "var(--primary-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Building2 size={18} color="var(--primary)" />
        </div>

        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
            {orgName}
          </span>
          {organization?.source && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color:
                  organization.source === "dentpulse" ? "#5b4cdb" :
                  organization.source === "dentledger" ? "#22b573" : "#f0a830",
                background:
                  organization.source === "dentpulse" ? "rgba(91,76,219,0.08)" :
                  organization.source === "dentledger" ? "rgba(34,181,115,0.08)" : "rgba(240,168,48,0.08)",
                padding: "2px 8px",
                borderRadius: 4,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {organization.source === "dentpulse" ? "DentPulse" :
               organization.source === "dentledger" ? "DentLedger" : "DentScale"}
            </span>
          )}
        </div>

        {owners.length > 0 && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "#5b4cdb",
              background: "rgba(91,76,219,0.08)",
              padding: "3px 10px",
              borderRadius: 6,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <Crown size={11} />
            {owners.length} owner{owners.length !== 1 ? "s" : ""}
          </span>
        )}

        {members.length > 0 && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "#22b573",
              background: "rgba(34,181,115,0.08)",
              padding: "3px 10px",
              borderRadius: 6,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <User size={11} />
            {members.length} member{members.length !== 1 ? "s" : ""}
          </span>
        )}

        {/* Permission column headers hint */}
        {expanded && (
          <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
            {permissionConfig.map((p) => (
              <span
                key={p.key}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  width: 54,
                  textAlign: "center",
                }}
              >
                {p.label.split(" ")[0]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded: Owners then Members */}
      {expanded && (
        <div>
          {owners.map((owner) => (
            <PersonRow
              key={owner.user_id || owner.id}
              person={owner}
              isOwner={true}
              orgId={orgId}
              onTogglePermission={onTogglePermission}
              indent={false}
            />
          ))}

          {members.map((member) => (
            <PersonRow
              key={member.user_id || member.id}
              person={member}
              isOwner={false}
              orgId={orgId}
              onTogglePermission={onTogglePermission}
              indent={true}
            />
          ))}

          {owners.length === 0 && members.length === 0 && (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              No users in this organization
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function UserTable({ orgData, onTogglePermission }) {
  if (!orgData || orgData.length === 0) {
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
          No organizations found
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
          Try adjusting your search or filter criteria
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {orgData.map((item, i) => (
        <OrgCard
          key={item.organization?.id || i}
          item={item}
          onTogglePermission={onTogglePermission}
        />
      ))}
    </div>
  );
}
