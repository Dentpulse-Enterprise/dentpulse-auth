import { useState, useMemo, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import StatsCards from "./components/StatsCards";
import UserTable from "./components/UserTable";
import { fetchUsersWithOrg } from "./services/api";
import { Users, Loader, AlertCircle, Activity, BookOpen, TrendingUp } from "lucide-react";

const SOURCE_FILTERS = [
  { key: "all", label: "All Sources", icon: Users, color: "#5b4cdb" },
  { key: "dentpulse", label: "DentPulse Enterprise", icon: Activity, color: "#5b4cdb" },
  { key: "dentledger", label: "DentLedger", icon: BookOpen, color: "#22b573" },
  { key: "dentscale", label: "DentScale", icon: TrendingUp, color: "#f0a830" },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("access_token")
  );
  const [orgData, setOrgData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsersWithOrg();
      setOrgData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Flatten all users for StatsCards
  const allUsers = useMemo(() => {
    const users = [];
    for (const item of orgData) {
      for (const o of item.owners || []) users.push(o);
      for (const m of item.members || []) users.push(m);
    }
    return users;
  }, [orgData]);

  // Filter orgs by search and source
  const filteredOrgData = useMemo(() => {
    let list = orgData;

    // Source filter: only show orgs that have at least one user with that permission
    if (sourceFilter !== "all") {
      list = list
        .map((item) => {
          const owners = (item.owners || []).filter((u) => u.permissions?.[sourceFilter]);
          const members = (item.members || []).filter((u) => u.permissions?.[sourceFilter]);
          if (owners.length === 0 && members.length === 0) return null;
          return { ...item, owners, members };
        })
        .filter(Boolean);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list
        .map((item) => {
          const orgMatch = item.organization?.name?.toLowerCase().includes(q);
          const matchingOwners = (item.owners || []).filter(
            (u) =>
              u.full_name?.toLowerCase().includes(q) ||
              u.email?.toLowerCase().includes(q)
          );
          const matchingMembers = (item.members || []).filter(
            (u) =>
              u.full_name?.toLowerCase().includes(q) ||
              u.email?.toLowerCase().includes(q)
          );
          // If org name matches, show all users; otherwise only matching users
          if (orgMatch) return item;
          if (matchingOwners.length > 0 || matchingMembers.length > 0) {
            return { ...item, owners: matchingOwners, members: matchingMembers };
          }
          return null;
        })
        .filter(Boolean);
    }

    return list;
  }, [orgData, searchQuery, sourceFilter]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setSidebarOpen(false);
    setIsAuthenticated(false);
  };

  // Toggle permission locally (static, no API call for now).
  // If enabling for a member and owner lacks it, auto-enable owner too.
  const handleTogglePermission = (userId, permKey, orgId) => {
    setOrgData((prev) =>
      prev.map((item) => {
        if (item.organization?.id !== orgId) return item;

        const allPeople = [...(item.owners || []), ...(item.members || [])];
        const target = allPeople.find((u) => (u.user_id || u.id) === userId);
        if (!target) return item;

        const newValue = !target.permissions?.[permKey];

        // Collect user IDs that need updating
        const updateMap = new Map();
        updateMap.set(userId, { ...target.permissions, [permKey]: newValue });

        // If enabling for a member, auto-enable for owners who lack it
        if (newValue && target.role !== "owner") {
          for (const owner of item.owners || []) {
            const oid = owner.user_id || owner.id;
            if (!owner.permissions?.[permKey]) {
              updateMap.set(oid, { ...owner.permissions, [permKey]: true });
            }
          }
        }

        return {
          ...item,
          owners: (item.owners || []).map((o) => {
            const newPerms = updateMap.get(o.user_id || o.id);
            return newPerms ? { ...o, permissions: newPerms } : o;
          }),
          members: (item.members || []).map((m) => {
            const newPerms = updateMap.get(m.user_id || m.id);
            return newPerms ? { ...m, permissions: newPerms } : m;
          }),
        };
      })
    );
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />

      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <main
        style={{
          padding: "28px 24px 48px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
        className="sm:px-8 lg:px-10"
      >
        {/* Page Header */}
        <div
          style={{
            marginBottom: 28,
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={22} color="var(--primary)" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--text)",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                }}
              >
                Organization App Management
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginTop: 2,
                }}
              >
                Manage user access and permissions across your organization
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ marginBottom: 20 }}>
          <StatsCards users={allUsers} />
        </div>

        {/* Source Filter */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 20,
            animation: "fadeIn 0.35s ease-out 0.1s both",
          }}
        >
          {SOURCE_FILTERS.map((f) => {
            const Icon = f.icon;
            const active = sourceFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setSourceFilter(f.key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 14px",
                  borderRadius: 10,
                  border: active ? `1px solid ${f.color}` : "1px solid var(--border)",
                  background: active ? f.color : "#fff",
                  color: active ? "#fff" : "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: active ? `0 2px 8px ${f.color}33` : "var(--shadow-sm)",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={15} color={active ? "#fff" : f.color} />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Info Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: 16,
            animation: "fadeIn 0.4s ease-out 0.15s both",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-secondary)",
              background: "#fff",
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          >
            {filteredOrgData.length} organization{filteredOrgData.length !== 1 ? "s" : ""} &middot;{" "}
            {allUsers.length} total users
          </span>
        </div>

        {/* Loading State */}
        {loading && (
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
              style={{ margin: "0 auto 16px", animation: "spin 1s linear infinite" }}
            />
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>
              Loading organizations...
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
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
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
              Failed to load organizations
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
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
        )}

        {/* Organization Tree */}
        {!loading && !error && (
          <div style={{ animation: "fadeIn 0.4s ease-out 0.25s both" }}>
            <UserTable
              orgData={filteredOrgData}
              onTogglePermission={handleTogglePermission}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
