"use client";
import React, { useState } from "react";
import "./landingpage.css";

type Section = "home" | "about" | "features" | "tutorial";
type View = "main" | "login" | "signup";

type LandingPageProps = { onStart?: () => void };

export default function Home({ onStart }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [currentView, setCurrentView] = useState<View>("main");

  const scrollToSection = (sectionId: string) => {
    if (currentView !== "main") setCurrentView("main");
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSection(sectionId as Section);
      }
    }, 100);
  };

  const NavButton = ({
    section,
    label,
    isActive,
  }: {
    section: Section;
    label: string;
    isActive: boolean;
  }) => (
    <button
      onClick={() => scrollToSection(section)}
      className={`tab${isActive ? " active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );

  const ViewButton = ({
    view,
    label,
    isActive,
  }: {
    view: View;
    label: string;
    isActive: boolean;
  }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        if (view === "main") setActiveSection("home");
      }}
      className={`tab${isActive ? " active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );

  const HomeSection = () => (
    <section id="home" className="section">
      {/* floating emojis */}
      <div className="float-layer">
        <div className="float lg" style={{ top: "8rem", left: "4rem" }}>
          🔬
        </div>
        <div className="float md animation-delay-3000" style={{ top: "12rem", right: "5rem" }}>
          📱
        </div>
        <div className="float md animation-delay-5000" style={{ bottom: "8rem", left: "6rem" }}>
          🧬
        </div>
        <div className="float lg animation-delay-2000" style={{ bottom: "10rem", right: "4rem" }}>
          🩺
        </div>
        <div className="float small animation-delay-4000" style={{ top: "15rem", left: "25%" }}>
          🩹
        </div>
        <div className="float md animation-delay-6000" style={{ bottom: "2.5rem", right: "25%" }}>
          💊
        </div>
      </div>

      {/* hero */}
      <div className="hero">
        <h1 className="title">Skinalyze</h1>
        <p className="lead">
          AI-powered skin disease detection through image analysis. Upload a photo or use your camera
          to get instant skin condition insights
        </p>

        <div className="badges">
          <span className="badge">⚡ Instant Analysis</span>
          <span className="badge" style={{ background: "linear-gradient(90deg, var(--blue-100), var(--blue-200))" }}>
            🔒 Secure &amp; Private
          </span>
        </div>

        <div className="row-24 wrap" style={{ justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => scrollToSection("about")}>
            Learn More
          </button>
          <button className="btn btn-outline" onClick={() => scrollToSection("tutorial")}>
            View Tutorial
          </button>
          {onStart && (
              <button className="btn btn-success start-app" onClick={onStart}>
                Start App
              </button>
          )}
        </div>
      </div>
    </section>
  );

  const AboutSection = () => (
    <section id="about" className="section">
      <div className="bg-dots">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
        <div className="blob b4"></div>
      </div>

      <div className="card wide">
        <div className="center stack-24">
          <h2 className="section-title">About US</h2>
          <div className="section-rule"></div>

          <p
            className="lead"
            style={{
              marginBottom: "1.5rem",
              background: "linear-gradient(90deg,#fff,#eff6ff)",
              padding: "2rem",
              borderRadius: "16px",
              color: "#334155",
            }}
          >
            We're democratizing access to skin health insights through cutting-edge AI technology. Our
            mission is to provide early detection and awareness of skin conditions, making
            dermatological screening accessible to everyone, anywhere.
          </p>

          <div className="pill-row">
            <div className="pill">🌍 Accessible</div>
            <div className="pill">💡 Innovative</div>
            <div className="pill">🔒 Reliable</div>
          </div>
        </div>
      </div>
    </section>
  );

  const FeaturesSection = () => (
    <section id="features" className="section">
      <div className="bg-dots">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
      </div>

      <div className="card wide" style={{ marginBottom: "2.5rem" }}>
        <div className="center stack-24">
          <h2 className="section-title">Our Features</h2>
          <div className="section-rule"></div>
        </div>

        {/* How it works */}
        <div className="card" style={{ background: "linear-gradient(135deg,#fff,#f0f7ff)" }}>
          <div className="center stack-24">
            <h3 style={{ fontSize: 28, margin: 0, color: "#111827", fontWeight: 800 }}>How It Works</h3>
            <p className="lead" style={{ marginBottom: 0 }}>
              Using advanced machine learning algorithms trained on thousands of dermatological images,
              Skinalyze can identify potential skin conditions, analyze skin health, and provide
              personalized recommendations for skincare and medical consultation.
            </p>
            <div style={{ color: "#2563eb", fontWeight: 700 }}>AI-Powered • Fast • Accurate</div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-3" style={{ marginTop: "2rem" }}>
          <div className="feature">
            <div className="icon">📸</div>
            <h4>Image Analysis</h4>
            <p>Upload photos for instant AI-powered skin condition analysis with 95% accuracy</p>
            <div style={{ marginTop: ".75rem", color: "#2563eb", fontWeight: 700 }}>⚡ Instant Results</div>
          </div>

          <div className="feature">
            <div className="icon">📷</div>
            <h4>Camera Detection</h4>
            <p>Use your device camera for real-time skin health monitoring and analysis</p>
            <div style={{ marginTop: ".75rem", color: "#2563eb", fontWeight: 700 }}>📱 Real-time Scan</div>
          </div>

          <div className="feature">
            <div className="icon">🔬</div>
            <h4>AI Insights</h4>
            <p>Machine learning helps identify potential skin conditions and provides recommendations</p>
            <div style={{ marginTop: ".75rem", color: "#2563eb", fontWeight: 700 }}>🎯 Smart Analysis</div>
          </div>
        </div>
      </div>
    </section>
  );

  const TutorialSection = () => (
    <section id="tutorial" className="section">
      <div className="card narrow">
        <h2 className="section-title">How to Use Skinalyze</h2>
        <div className="section-rule"></div>

        <div className="stack-32">
          {/* Step 1 */}
          <div className="step">
            <div className="step-num">1</div>
            <div>
              <h3 style={{ margin: "0 0 .5rem 0", fontSize: 20, color: "#111827" }}>Upload Your Image</h3>
              <p className="help" style={{ marginBottom: "1rem" }}>
                Take a clear, well-lit photo of your skin condition or upload an existing image from your device.
                Make sure the area is visible and the image is in focus.
              </p>
              <div className="tip"><strong>Tip:</strong> Use natural lighting and avoid shadows for best results.</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="step">
            <div className="step-num">2</div>
            <div>
              <h3 style={{ margin: "0 0 .5rem 0", fontSize: 20, color: "#111827" }}>AI Analysis</h3>
              <p className="help" style={{ marginBottom: "1rem" }}>
                Our advanced AI algorithms will analyze your image within seconds, identifying potential skin
                conditions, analyzing texture, pigmentation, and other important factors.
              </p>
              <div className="tip"><strong>Processing:</strong> Analysis typically takes 2–5 seconds.</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step">
            <div className="step-num">3</div>
            <div>
              <h3 style={{ margin: "0 0 .5rem 0", fontSize: 20, color: "#111827" }}>Get Your Results</h3>
              <p className="help" style={{ marginBottom: "1rem" }}>
                Review your personalized analysis report including potential conditions identified, confidence
                levels, and recommended next steps or skincare advice.
              </p>
              <div className="tip"><strong>Remember:</strong> This is for informational purposes only. Consult a dermatologist for medical advice.</div>
            </div>
          </div>
        </div>

        <div className="mt-12 center">
          <button className="btn btn-primary" onClick={onStart ? onStart : () => scrollToSection("home")}> 
            Try Skinalyze Now
          </button>
        </div>
      </div>
    </section>
  );

  const LoginPage = () => (
    <div className="section">
      <div className="form-card">
        <h2>Welcome Back</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-field">
            <label className="label" htmlFor="login-email">Email</label>
            <input id="login-email" type="email" className="input" placeholder="Enter your email" required />
          </div>
          <div className="form-field">
            <label className="label" htmlFor="login-password">Password</label>
            <input id="login-password" type="password" className="input" placeholder="Enter your password" required />
          </div>
          <div className="row-16" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: 14, color: "#475569" }}>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="link">Forgot password?</a>
          </div>
          <button type="submit" className="btn" style={{ width: "100%", background: "linear-gradient(90deg,#ec4899,#7c3aed)", color: "#fff" }}>
            Sign In
          </button>
        </form>
        <p className="help" style={{ textAlign: "center", marginTop: "1rem" }}>
          Don&apos;t have an account?{" "}
          <button onClick={() => setCurrentView("signup")} className="link">Sign up</button>
        </p>
      </div>
    </div>
  );

  const SignUpPage = () => (
    <div className="section">
      <div className="form-card">
        <h2>Create Account</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row-16" style={{ width: "100%" }}>
            <div style={{ flex: 1 }}>
              <label className="label" htmlFor="first-name">First Name</label>
              <input id="first-name" type="text" className="input" placeholder="John" required />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label" htmlFor="last-name">Last Name</label>
              <input id="last-name" type="text" className="input" placeholder="Doe" required />
            </div>
          </div>

          <div className="form-field">
            <label className="label" htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" className="input" placeholder="john@example.com" required />
          </div>

          <div className="form-field">
            <label className="label" htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" className="input" placeholder="Create a strong password" required />
          </div>

          <div className="form-field">
            <label className="label" htmlFor="confirm-password">Confirm Password</label>
            <input id="confirm-password" type="password" className="input" placeholder="Confirm your password" required />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: 14, color: "#475569", marginBottom: "1rem" }}>
            <input type="checkbox" required /> I agree to the <a className="link" href="#">Terms of Service</a> and{" "}
            <a className="link" href="#">Privacy Policy</a>
          </label>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Create Account
          </button>
        </form>

        <p className="help" style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account?{" "}
          <button onClick={() => setCurrentView("login")} className="link">Sign in</button>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-page" style={{ position: "relative", overflow: "hidden" }}>
      {/* decorative background */}
      <div className="bg-dots">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
        <div className="blob b4"></div>
      </div>

      {/* nav */}
      <nav className="navbar">
        <div className="nav-inner container">
          <div className="brand">
            <img src="/Logohackknight.png" alt="Skinalyze Logo" />
          </div>
          <div className="nav-actions">
            <NavButton section="home" label="Home"   isActive={currentView === "main" && activeSection === "home"} />
            <NavButton section="about" label="About" isActive={currentView === "main" && activeSection === "about"} />
            <NavButton section="features" label="Features" isActive={currentView === "main" && activeSection === "features"} />
            <NavButton section="tutorial" label="Tutorial" isActive={currentView === "main" && activeSection === "tutorial"} />
            <ViewButton view="login"  label="Login"   isActive={currentView === "login"} />
            <ViewButton view="signup" label="Sign Up" isActive={currentView === "signup"} />
          </div>
        </div>
      </nav>

      {/* main */}
      <main className="pad-top-96">
        {currentView === "main" && (
          <>
            <HomeSection />
            <AboutSection />
            <FeaturesSection />
            <TutorialSection />
          </>
        )}
        {currentView === "login" && <LoginPage />}
        {currentView === "signup" && <SignUpPage />}
      </main>
    </div>
  );
}
