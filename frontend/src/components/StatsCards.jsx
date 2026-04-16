import { Users, Activity, BookOpen, TrendingUp } from "lucide-react";

export default function StatsCards({ users }) {
  const total = users.length;
  const dentpulseCount = users.filter((u) => u.permissions?.dentpulse).length;
  const dentledgerCount = users.filter((u) => u.permissions?.dentledger).length;
  const dentscaleCount = users.filter((u) => u.permissions?.dentscale).length;

  const stats = [
    {
      label: "Total Users",
      value: total,
      icon: Users,
      iconColor: "#5b4cdb",
      iconBg: "#ededfc",
      borderAccent: "#5b4cdb",
    },
    {
      label: "DentPulse Enterprise",
      value: dentpulseCount,
      icon: Activity,
      iconColor: "#5b4cdb",
      iconBg: "#ededfc",
      borderAccent: "#5b4cdb",
    },
    {
      label: "DentLedger",
      value: dentledgerCount,
      icon: BookOpen,
      iconColor: "#22b573",
      iconBg: "#eafaf1",
      borderAccent: "#22b573",
    },
    {
      label: "DentScale",
      value: dentscaleCount,
      icon: TrendingUp,
      iconColor: "#f0a830",
      iconBg: "#fef8ec",
      borderAccent: "#f0a830",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
      }}
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid var(--border)",
              padding: "22px 24px",
              boxShadow: "var(--shadow-card)",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.25s ease",
              animation: `fadeIn 0.4s ease-out ${i * 0.08}s both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = stat.borderAccent + "30";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-card)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${stat.borderAccent}, ${stat.borderAccent}80)`,
                borderRadius: "14px 14px 0 0",
              }}
            />
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: stat.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Icon size={22} color={stat.iconColor} />
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-secondary)",
                marginTop: 6,
              }}
            >
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
