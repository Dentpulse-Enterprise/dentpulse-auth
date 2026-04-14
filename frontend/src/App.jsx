import { useState, useMemo, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import StatsCards from "./components/StatsCards";
import UserTable from "./components/UserTable";
import { fetchAdminPanelUsers, updateUserPermission } from "./services/api";
import { Users, Loader, AlertCircle } from "lucide-react";

function App() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminPanelUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.clinic && u.clinic.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, currentPage, usersPerPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleTogglePermission = async (userId, permKey) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const nextPermissions = {
      ...target.permissions,
      [permKey]: !target.permissions[permKey],
    };

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, permissions: nextPermissions } : u))
    );

    try {
      await updateUserPermission(userId, {
        name: target.name,
        email: target.email,
        clinic: target.clinic,
        permissions: nextPermissions,
      });
    } catch (err) {
      console.error("Failed to persist permission toggle:", err);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, permissions: target.permissions } : u
        )
      );
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
                User Management
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
        <div style={{ marginBottom: 28 }}>
          <StatsCards users={users} />
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
            Showing {Math.min((currentPage - 1) * usersPerPage + 1, filteredUsers.length)}-{Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
            {searchQuery && ` (filtered from ${users.length})`}
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
              Loading users...
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
              Failed to load users
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
              {error}
            </div>
            <button
              onClick={loadUsers}
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

        {/* User Table */}
        {!loading && !error && (
          <div style={{ animation: "fadeIn 0.4s ease-out 0.25s both" }}>
            <UserTable
              users={paginatedUsers}
              onTogglePermission={handleTogglePermission}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginTop: 20,
                  animation: "fadeIn 0.4s ease-out 0.3s both",
                }}
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: currentPage === 1 ? "var(--bg)" : "#fff",
                    color: currentPage === 1 ? "var(--text-muted)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: currentPage === 1 ? "default" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: currentPage === 1 ? "var(--bg)" : "#fff",
                    color: currentPage === 1 ? "var(--text-muted)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: currentPage === 1 ? "default" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  Prev
                </button>

                {(() => {
                  const pages = [];
                  let start = Math.max(1, currentPage - 2);
                  let end = Math.min(totalPages, start + 4);
                  if (end - start < 4) start = Math.max(1, end - 4);

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          border: i === currentPage ? "1px solid var(--primary)" : "1px solid var(--border)",
                          background: i === currentPage ? "var(--primary)" : "#fff",
                          color: i === currentPage ? "#fff" : "var(--text-secondary)",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
                })()}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: currentPage === totalPages ? "var(--bg)" : "#fff",
                    color: currentPage === totalPages ? "var(--text-muted)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: currentPage === totalPages ? "default" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: currentPage === totalPages ? "var(--bg)" : "#fff",
                    color: currentPage === totalPages ? "var(--text-muted)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: currentPage === totalPages ? "default" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  Last
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
