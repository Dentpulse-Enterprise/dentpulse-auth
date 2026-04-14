import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader } from "lucide-react";
import { loginWithEmail } from "../services/api";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginWithEmail(email, password);
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      onLogin({ email, token: data.access_token });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Background decoration */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.bgOrb3} />

      <div className="login-container" style={styles.container}>
        {/* Left side — branding */}
        <div className="login-branding" style={styles.brandingSide}>
          <div style={styles.brandingContent}>
            <div style={styles.logoMark}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <rect width="44" height="44" rx="12" fill="rgba(255,255,255,0.15)" />
                <path
                  d="M22 10c-2.5 0-4.5 1-6 3-1.5 2-2 4.5-2 7 0 3 1 5.5 2.5 7.5 1 1.3 2 2.8 2.5 4.5.3 1 1.2 2 2.5 2h1c1.3 0 2.2-1 2.5-2 .5-1.7 1.5-3.2 2.5-4.5C29 25.5 30 23 30 20c0-2.5-.5-5-2-7s-3.5-3-6-3z"
                  fill="white"
                  opacity="0.9"
                />
                <circle cx="19" cy="19" r="1.5" fill="rgba(91,76,219,0.8)" />
                <circle cx="25" cy="19" r="1.5" fill="rgba(91,76,219,0.8)" />
              </svg>
            </div>
            <h1 style={styles.brandTitle}>DentPulse</h1>
            <p style={styles.brandSubtitle}>Enterprise Admin</p>
            <div style={styles.brandDivider} />
            <p style={styles.brandDesc}>
              Manage users, permissions, and clinic access across your entire dental practice network.
            </p>
            <div style={styles.featureList}>
              {[
                "User & role management",
                "Clinic access control",
                "Permission toggles",
              ].map((item) => (
                <div key={item} style={styles.featureItem}>
                  <div style={styles.featureCheck}>✓</div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={styles.brandFooter}>© 2026 DentPulse Enterprise</p>
        </div>

        {/* Right side — login form */}
        <div className="login-form-side" style={styles.formSide}>
          <div style={styles.formWrapper}>
            {/* Mobile logo */}
            <div className="login-mobile-logo" style={styles.mobileLogo}>
              <div style={styles.mobileLogoMark}>
                <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
                  <rect width="44" height="44" rx="12" fill="var(--color-primary)" />
                  <path
                    d="M22 10c-2.5 0-4.5 1-6 3-1.5 2-2 4.5-2 7 0 3 1 5.5 2.5 7.5 1 1.3 2 2.8 2.5 4.5.3 1 1.2 2 2.5 2h1c1.3 0 2.2-1 2.5-2 .5-1.7 1.5-3.2 2.5-4.5C29 25.5 30 23 30 20c0-2.5-.5-5-2-7s-3.5-3-6-3z"
                    fill="white"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <span style={styles.mobileLogoText}>DentPulse</span>
            </div>

            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome back</h2>
              <p style={styles.formSubtitle}>Sign in to your admin account</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>!</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form} autoComplete="on">
              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="login-email">
                  Email address
                </label>
                <div
                  style={{
                    ...styles.inputWrapper,
                    ...(focusedField === "email" ? styles.inputWrapperFocused : {}),
                    ...(error && !email.trim() ? styles.inputWrapperError : {}),
                  }}
                >
                  <Mail
                    size={18}
                    style={{
                      ...styles.inputIcon,
                      color:
                        focusedField === "email"
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                    }}
                  />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    style={styles.input}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label} htmlFor="login-password">
                    Password
                  </label>
                  <button type="button" style={styles.forgotLink} tabIndex={-1}>
                    Forgot password?
                  </button>
                </div>
                <div
                  style={{
                    ...styles.inputWrapper,
                    ...(focusedField === "password" ? styles.inputWrapperFocused : {}),
                    ...(error && !password.trim() ? styles.inputWrapperError : {}),
                  }}
                >
                  <Lock
                    size={18}
                    style={{
                      ...styles.inputIcon,
                      color:
                        focusedField === "password"
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                    }}
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    style={styles.input}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  ...(loading ? styles.submitBtnDisabled : {}),
                }}
              >
                {loading ? (
                  <>
                    <Loader size={18} style={styles.spinner} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>

            <p style={styles.footerText}>
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f4f6fa 0%, #eceef8 50%, #f0eef9 100%)",
    padding: "16px",
    position: "relative",
    overflow: "hidden",
  },

  /* Floating background orbs */
  bgOrb1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(91,76,219,0.08) 0%, transparent 70%)",
    top: "-150px",
    right: "-100px",
    pointerEvents: "none",
  },
  bgOrb2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,181,115,0.06) 0%, transparent 70%)",
    bottom: "-100px",
    left: "-80px",
    pointerEvents: "none",
  },
  bgOrb3: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(91,76,219,0.05) 0%, transparent 70%)",
    bottom: "20%",
    right: "10%",
    pointerEvents: "none",
  },

  container: {
    display: "flex",
    width: "100%",
    maxWidth: "960px",
    minHeight: "580px",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(30,27,75,0.08), 0 4px 16px rgba(0,0,0,0.04)",
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    animation: "scaleIn 0.4s ease-out both",
  },

  /* ── Left branding panel ── */
  brandingSide: {
    flex: "0 0 400px",
    background: "linear-gradient(180deg, #1e1b4b 0%, #1a1745 50%, #151234 100%)",
    padding: "48px 40px 32px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  brandingContent: {
    position: "relative",
    zIndex: 1,
  },
  logoMark: {
    marginBottom: "28px",
  },
  brandTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "-0.5px",
    marginBottom: "4px",
  },
  brandSubtitle: {
    fontSize: "15px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.55)",
    marginBottom: "24px",
  },
  brandDivider: {
    width: "40px",
    height: "3px",
    borderRadius: "2px",
    background: "linear-gradient(90deg, var(--color-primary, #5b4cdb), rgba(91,76,219,0.3))",
    marginBottom: "24px",
  },
  brandDesc: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "32px",
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "13.5px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.75)",
  },
  featureCheck: {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    background: "rgba(91,76,219,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: "#a5b4fc",
    fontWeight: 700,
    flexShrink: 0,
  },
  brandFooter: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.3)",
    position: "relative",
    zIndex: 1,
  },

  /* ── Right form panel ── */
  formSide: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 40px",
    minWidth: 0,
  },
  formWrapper: {
    width: "100%",
    maxWidth: "360px",
  },

  /* Mobile logo (hidden on desktop via media query workaround below) */
  mobileLogo: {
    display: "none",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
    justifyContent: "center",
  },
  mobileLogoMark: {},
  mobileLogoText: {
    fontSize: "22px",
    fontWeight: 700,
    color: "var(--color-text, #1a1d2e)",
    letterSpacing: "-0.5px",
  },

  formHeader: {
    marginBottom: "28px",
  },
  formTitle: {
    fontSize: "26px",
    fontWeight: 700,
    color: "var(--color-text, #1a1d2e)",
    letterSpacing: "-0.5px",
    marginBottom: "6px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "var(--color-text-secondary, #6b7185)",
  },

  /* Error */
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    marginBottom: "20px",
    background: "var(--color-danger-light, #fdf0f0)",
    border: "1px solid rgba(224,92,92,0.2)",
    borderRadius: "10px",
    fontSize: "13px",
    color: "var(--color-danger, #e05c5c)",
    fontWeight: 500,
    animation: "fadeIn 0.3s ease-out both",
  },
  errorIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "var(--color-danger, #e05c5c)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
  },

  /* Form fields */
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--color-text, #1a1d2e)",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotLink: {
    fontSize: "12.5px",
    fontWeight: 500,
    color: "var(--color-primary, #5b4cdb)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 14px",
    height: "46px",
    border: "1.5px solid var(--color-border, #e2e5ef)",
    borderRadius: "10px",
    background: "var(--color-bg, #f4f6fa)",
    transition: "all 0.2s ease",
  },
  inputWrapperFocused: {
    borderColor: "var(--color-primary, #5b4cdb)",
    background: "#ffffff",
    boxShadow: "0 0 0 3px rgba(91,76,219,0.1)",
  },
  inputWrapperError: {
    borderColor: "var(--color-danger, #e05c5c)",
    boxShadow: "0 0 0 3px rgba(224,92,92,0.08)",
  },
  inputIcon: {
    flexShrink: 0,
    transition: "color 0.2s ease",
  },
  input: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--color-text, #1a1d2e)",
    outline: "none",
    fontFamily: "inherit",
    minWidth: 0,
  },
  eyeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "var(--color-text-muted, #9ca3b8)",
    borderRadius: "6px",
    transition: "color 0.2s ease",
    flexShrink: 0,
  },

  /* Submit button */
  submitBtn: {
    marginTop: "4px",
    height: "46px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #5b4cdb 0%, #4a3bc7 100%)",
    color: "#ffffff",
    fontSize: "14.5px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(91,76,219,0.25)",
    fontFamily: "inherit",
  },
  submitBtnDisabled: {
    opacity: 0.75,
    cursor: "not-allowed",
  },
  spinner: {
    animation: "spin 1s linear infinite",
  },

  footerText: {
    marginTop: "28px",
    textAlign: "center",
    fontSize: "12px",
    color: "var(--color-text-muted, #9ca3b8)",
  },
};
