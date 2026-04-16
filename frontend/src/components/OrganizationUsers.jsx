import { useState, useEffect } from "react";
import { fetchUsersWithOrg } from "../services/api";
import {
  Loader,
  AlertCircle,
  Building2,
  ChevronRight,
  ChevronDown,
  Crown,
  User,
  Users,
  UserSearch,
  Search,
} from "lucide-react";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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
  for (let i = 0; i < (name || "").length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

function PersonRow({ person, isOwner, indent = false }) {
  const RoleIcon = isOwner ? Crown : User;
  const roleColor = isOwner ? "#5b4cdb" : "#22b573";
  const roleLabel = isOwner ? "Owner" : "Member";
  const displayName = person.full_name || "Unknown";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: indent ? "8px 16px 8px 52px" : "10px 16px",
        borderRadius: 8,
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f9fc")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: roleColor,
          flexShrink: 0,
        }}
      />

      {person.avatar_url ? (
        <img
          src={person.avatar_url}
          alt={displayName}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: getAvatarGradient(displayName),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {getInitials(displayName)}
        </div>
      )}

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
            {roleLabel}
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
    </div>
  );
}

function OrgCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const { organization, owners, members } = item;
  const totalPeople = owners.length + members.length;
  const orgName = organization?.name || "Unknown Organization";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-card)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-sm)")
      }
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 16px",
          cursor: "pointer",
          background: expanded ? "#f8f9fc" : "#fff",
          borderBottom: expanded ? "1px solid var(--border-light)" : "none",
          transition: "background 0.15s",
          userSelect: "none",
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
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
            width: 36,
            height: 36,
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

        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {orgName}
          </span>
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
              padding: "3px 8px",
              borderRadius: 6,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <Crown size={10} />
            {owners.length}
          </span>
        )}

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: "var(--text-muted)",
            background: "var(--bg)",
            padding: "3px 8px",
            borderRadius: 6,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          <Users size={10} />
          {totalPeople}
        </span>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div style={{ padding: "4px 0 8px" }}>
          {owners.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  padding: "8px 16px 4px 52px",
                }}
              >
                Owners
              </div>
              {owners.map((owner) => (
                <PersonRow
                  key={owner.id || owner.user_id}
                  person={owner}
                  isOwner={true}
                />
              ))}
            </>
          )}

          {members.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  padding: "8px 16px 4px 52px",
                }}
              >
                Members
              </div>
              {members.map((member) => (
                <PersonRow
                  key={member.id || member.user_id}
                  person={member}
                  isOwner={false}
                />
              ))}
            </>
          )}

          {owners.length === 0 && members.length === 0 && (
            <div
              style={{
                padding: "16px 52px",
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

export default function OrganizationUsers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUsersWithOrg();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = searchQuery
    ? data.filter((item) => {
        const q = searchQuery.toLowerCase();
        const orgMatch = item.organization?.name?.toLowerCase().includes(q);
        const ownerMatch = item.owners?.some(
          (o) =>
            o.full_name?.toLowerCase().includes(q) ||
            o.email?.toLowerCase().includes(q)
        );
        const memberMatch = item.members?.some(
          (m) =>
            m.full_name?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q)
        );
        return orgMatch || ownerMatch || memberMatch;
      })
    : data;

  // Loading
  if (loading) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid var(--border)",
          padding: "64px 24px",
          textAlign: "center",
          boxShadow: "var(--shadow-card)",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <Loader
          size={32}
          color="var(--primary)"
          style={{
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-secondary)",
          }}
        >
          Loading organizations...
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #fecaca",
          padding: "48px 24px",
          textAlign: "center",
          boxShadow: "var(--shadow-card)",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <AlertCircle size={26} color="#ef4444" />
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 4,
          }}
        >
          Failed to load organizations
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            marginBottom: 20,
          }}
        >
          {error}
        </div>
        <button
          onClick={loadData}
          style={{
            padding: "10px 24px",
            borderRadius: 10,
            border: "none",
            background: "var(--primary)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search + count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <Search
            size={15}
            color="var(--text-muted)"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Search organizations, owners, members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 14px 9px 36px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              fontSize: 13,
              color: "var(--text)",
              background: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {filtered.length} organization{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Organizations List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((item, i) => (
          <OrgCard
            key={item.organization?.id || i}
            item={item}
          />
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid var(--border)",
              padding: "48px 24px",
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
              {data.length === 0 ? "No organizations found" : "No results found"}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginTop: 4,
              }}
            >
              {data.length === 0
                ? "No DentPulse organizations available"
                : "Try adjusting your search"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
