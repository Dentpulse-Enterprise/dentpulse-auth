import { useState } from "react";
import { ChevronRight, ChevronDown, User, Users } from "lucide-react";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const statusColors = {
  active: "#22b573",
  inactive: "#e05c5c",
};

function OwnerRow({ owner, members, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasMem = members.length > 0;

  return (
    <div>
      <div
        onClick={() => hasMem && setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          cursor: hasMem ? "pointer" : "default",
          borderRadius: 8,
          transition: "background 0.15s",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          if (hasMem) e.currentTarget.style.background = "#f8f9fc";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {hasMem ? (
          <span
            style={{
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}
          >
            {expanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </span>
        ) : (
          <span style={{ width: 20, flexShrink: 0 }} />
        )}

        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background:
              owner.is_active !== undefined
                ? owner.is_active
                  ? statusColors.active
                  : statusColors.inactive
                : statusColors.active,
            flexShrink: 0,
          }}
        />

        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "linear-gradient(135deg, #5b4cdb, #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {owner.profile_image ? (
            <img
              src={owner.profile_image}
              alt={owner.name}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
          ) : (
            getInitials(owner.name)
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text)",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {owner.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-secondary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {owner.email}
          </div>
        </div>

        {hasMem && (
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              background: "var(--bg)",
              padding: "2px 8px",
              borderRadius: 6,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {members.length} member{members.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {expanded &&
        members.map((member) => (
          <div
            key={member.id || member.email}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px 8px 56px",
              borderRadius: 6,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#f8f9fc")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background:
                  member.is_active !== undefined
                    ? member.is_active
                      ? statusColors.active
                      : statusColors.inactive
                    : statusColors.active,
                flexShrink: 0,
              }}
            />

            <User
              size={14}
              color="var(--text-muted)"
              style={{ flexShrink: 0 }}
            />

            <div style={{ minWidth: 0, flex: 1 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text)",
                }}
              >
                {member.name ||
                  [member.first_name, member.last_name]
                    .filter(Boolean)
                    .join(" ") ||
                  "Unknown"}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginLeft: 8,
                }}
              >
                {member.email}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}

function TenantCard({ tenantName, owners, members, source }) {
  const [expanded, setExpanded] = useState(false);
  const totalPeople = owners.length + members.length;

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

        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: statusColors.active,
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {tenantName}
          </span>
        </div>

        <span
          style={{
            fontSize: 11,
            color: source === "skMarketing" ? "#5b4cdb" : "#22b573",
            background:
              source === "skMarketing"
                ? "rgba(91,76,219,0.08)"
                : "rgba(34,181,115,0.08)",
            padding: "3px 10px",
            borderRadius: 6,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {source === "skMarketing" ? "SK Marketing" : "DentLedger"}
        </span>

        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
        >
          <Users size={12} />
          {totalPeople}
        </span>
      </div>

      {expanded && (
        <div style={{ padding: "4px 0" }}>
          {owners.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  padding: "8px 16px 4px 48px",
                }}
              >
                Owners
              </div>
              {owners.map((owner) => (
                <OwnerRow
                  key={owner.id || owner.email}
                  owner={{
                    name:
                      owner.name ||
                      [owner.first_name, owner.last_name]
                        .filter(Boolean)
                        .join(" ") ||
                      "Unknown",
                    email: owner.email,
                    is_active: owner.is_active,
                    profile_image: owner.profile_image,
                  }}
                  members={members}
                />
              ))}
            </div>
          )}

          {owners.length === 0 && members.length === 0 && (
            <div
              style={{
                padding: "16px 48px",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              No owners or members
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OwnerMembersTree({
  skMarketingData,
  dentLedgerData,
  loading,
  error,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceTab, setSourceTab] = useState("all");

  const filteredSkMarketing =
    sourceTab === "dentledger"
      ? []
      : skMarketingData.filter((item) => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          const tenantMatch = item.tenant?.name?.toLowerCase().includes(q);
          const ownerMatch = item.owners?.some(
            (o) =>
              `${o.first_name} ${o.last_name}`.toLowerCase().includes(q) ||
              o.email?.toLowerCase().includes(q)
          );
          const memberMatch = item.members?.some(
            (m) =>
              `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
              m.email?.toLowerCase().includes(q)
          );
          return tenantMatch || ownerMatch || memberMatch;
        });

  const filteredDentLedger =
    sourceTab === "skmarketing"
      ? []
      : dentLedgerData.filter((item) => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          const orgMatch = item.organization?.name?.toLowerCase().includes(q);
          const ownerMatch =
            item.owner?.name?.toLowerCase().includes(q) ||
            item.owner?.email?.toLowerCase().includes(q);
          const memberMatch = item.members?.some(
            (m) =>
              `${m.name} ${m.last_name || ""}`.toLowerCase().includes(q) ||
              m.email?.toLowerCase().includes(q)
          );
          return orgMatch || ownerMatch || memberMatch;
        });

  const totalItems = filteredSkMarketing.length + filteredDentLedger.length;

  if (loading) {
    return (
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
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-secondary)",
          }}
        >
          Loading users with tenants...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #fecaca",
          padding: "32px 24px",
          textAlign: "center",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--danger, #e05c5c)",
            marginBottom: 4,
          }}
        >
          Failed to load
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <input
          type="text"
          placeholder="Search tenants, owners, members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "9px 14px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            fontSize: 13,
            color: "var(--text)",
            background: "#fff",
            outline: "none",
          }}
        />

        {[
          { key: "all", label: "All" },
          { key: "skmarketing", label: "SK Marketing" },
          { key: "dentledger", label: "DentLedger" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSourceTab(tab.key)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border:
                sourceTab === tab.key
                  ? "1px solid var(--primary)"
                  : "1px solid var(--border)",
              background: sourceTab === tab.key ? "var(--primary)" : "#fff",
              color: sourceTab === tab.key ? "#fff" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}

        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          {totalItems} tenant{totalItems !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tree List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* SK Marketing tenants */}
        {filteredSkMarketing.map((item, i) => (
          <TenantCard
            key={`sk-${item.tenant?.id || i}`}
            tenantName={item.tenant?.name || "Unknown Tenant"}
            owners={item.owners || []}
            members={item.members || []}
            source="skMarketing"
          />
        ))}

        {/* DentLedger organizations */}
        {filteredDentLedger.map((item, i) => (
          <TenantCard
            key={`dl-${item.organization?.id || i}`}
            tenantName={item.organization?.name || "Unknown Organization"}
            owners={item.owner ? [item.owner] : []}
            members={item.members || []}
            source="dentLedger"
          />
        ))}

        {totalItems === 0 && (
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
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              No results found
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                marginTop: 4,
              }}
            >
              Try adjusting your search or filter
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
