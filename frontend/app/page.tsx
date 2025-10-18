"use client";

import { useState } from "react";
import NextImage from "next/image";
// Union type for safer section navigation
type Section = "home" | "about" | "features" | "tutorial";
type View = "main" | "login" | "signup";

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [currentView, setCurrentView] = useState<View>("main");

  // Smooth scroll to section (switches to main page first if needed)
  const scrollToSection = (sectionId: string) => {
    // First switch to main page if not already there
    if (currentView !== 'main') {
      setCurrentView('main');
    }
    
    // Small delay to ensure the main page is rendered before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId as Section);
      }
    }, 100);
  };

  const NavButton = ({ section, label, isActive }: { section: Section; label: string; isActive: boolean }) => (
    <button
      onClick={() => scrollToSection(section)}
      className={`px-8 py-4 text-xl font-black tracking-wide transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent border-b-4 border-blue-600 scale-105"
          : "bg-gradient-to-r from-gray-600 to-blue-500 bg-clip-text text-transparent hover:from-gray-800 hover:to-blue-600 hover:scale-105"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );

  const ViewButton = ({ view, label, isActive }: { view: View; label: string; isActive: boolean }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        if (view === 'main') {
          setActiveSection('home');
        }
      }}
      className={`px-8 py-4 text-xl font-black tracking-wide transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent border-b-4 border-blue-600 scale-105"
          : "bg-gradient-to-r from-gray-600 to-blue-500 bg-clip-text text-transparent hover:from-gray-800 hover:to-blue-600 hover:scale-105"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );

  // Home Section Component
  const HomeSection = () => (
    <section id="home" className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-16 text-4xl animate-bounce animation-delay-1000">🔬</div>
        <div className="absolute top-48 right-20 text-3xl animate-bounce animation-delay-3000">📱</div>
        <div className="absolute bottom-32 left-24 text-3xl animate-bounce animation-delay-5000">🧬</div>
        <div className="absolute bottom-40 right-16 text-4xl animate-bounce animation-delay-2000">🩺</div>
        <div className="absolute top-60 left-1/4 text-2xl animate-bounce animation-delay-4000">🩹</div>
        <div className="absolute bottom-10 right-1/4 text-3xl animate-bounce animation-delay-6000">💊</div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 text-center mb-16">
        <div className="relative pb-4">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight pb-2">
            Skinalyze
          </h1>
        </div>
        
        <div className="relative">
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered skin disease detection through image analysis. Upload a photo or use your camera to get instant skin condition insights
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <span className="bg-gradient-to-r from-white to-blue-100 text-blue-800 px-8 py-4 rounded-2xl text-lg font-bold border-2 border-blue-200 cursor-default">
              ⚡ Instant Analysis
            </span>
            <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-8 py-4 rounded-2xl text-lg font-bold border-2 border-blue-200 cursor-default">
              🔒 Secure & Private
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <button 
            onClick={() => scrollToSection('about')}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:from-blue-600 hover:to-blue-800 min-w-[200px]"
          >
            Learn More
          </button>
          <button 
            onClick={() => scrollToSection('tutorial')}
            className="bg-white text-blue-600 border-3 border-blue-500 px-12 py-5 rounded-2xl text-xl font-bold hover:bg-blue-50 min-w-[200px]"
          >
            View Tutorial
          </button>
        </div>
      </div>
    </section>
  );

  // About Section Component  
  const AboutSection = () => (
    <section id="about" className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-200 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-300 rounded-full animate-pulse animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400 rounded-full animate-pulse animation-delay-5000"></div>
      </div>

      <div className="relative z-10 bg-white/90 backdrop-blur-sm p-12 mx-8 rounded-2xl shadow-2xl max-w-5xl w-full border border-blue-100">
        {/* Enhanced Title */}
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-gray-700 via-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
            About Skinalyze
          </h2>
          <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mb-8"></div>
        </div>

        {/* Mission Content */}
        <div className="text-center mb-10">
          <p className="text-gray-700 leading-relaxed text-2xl max-w-4xl mx-auto mb-10 bg-gradient-to-r from-white to-blue-50 p-8 rounded-xl border-2 border-blue-200">
            We're democratizing access to skin health insights through cutting-edge AI technology. Our mission is to provide early detection and awareness of skin conditions, making dermatological screening accessible to everyone, anywhere.
          </p>
          
          {/* Mission Values */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-gradient-to-r from-white to-blue-100 text-blue-800 px-6 py-3 rounded-full text-lg font-semibold border border-blue-300 hover:scale-105 transition-transform cursor-default">
              🌍 Accessible
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-6 py-3 rounded-full text-lg font-semibold border border-blue-300 hover:scale-105 transition-transform cursor-default">
              💡 Innovative
            </div>
            <div className="bg-gradient-to-r from-blue-200 to-blue-300 text-blue-800 px-6 py-3 rounded-full text-lg font-semibold border border-blue-300 hover:scale-105 transition-transform cursor-default">
              🔒 Reliable
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Features Section Component
  const FeaturesSection = () => (
    <section id="features" className="relative min-h-screen flex flex-col justify-center items-center px-4 py-16 overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-400 rounded-full animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-500 rounded-full animate-pulse animation-delay-6000"></div>
      </div>

      <div className="relative z-10 bg-white/90 backdrop-blur-sm p-10 mx-8 rounded-2xl shadow-2xl mb-16 max-w-6xl w-full border border-blue-100">
        {/* Enhanced Title */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-700 via-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Features
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* How It Works Section */}
        <div className="mb-12">
          <div className="group bg-gradient-to-br from-white to-blue-100 p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-200">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">How It Works</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-xl text-center mb-8">
              Using advanced machine learning algorithms trained on thousands of dermatological images,
              Skinalyze can identify potential skin conditions, analyze skin health, and provide
              personalized recommendations for skincare and medical consultation.
            </p>
            <div className="flex justify-center items-center text-blue-600 font-semibold text-lg">
              <span>AI-Powered • Fast • Accurate</span>
            </div>
          </div>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="group text-center p-8 bg-gradient-to-br from-white to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-200">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
              📸
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-4">Image Analysis</h4>
            <p className="text-gray-600 leading-relaxed">Upload photos for instant AI-powered skin condition analysis with 95% accuracy</p>
            <div className="mt-4 text-blue-600 font-semibold text-sm">
              ⚡ Instant Results
            </div>
          </div>
          
          <div className="group text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-200">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
              📷
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-4">Camera Detection</h4>
            <p className="text-gray-600 leading-relaxed">Use your device camera for real-time skin health monitoring and analysis</p>
            <div className="mt-4 text-blue-600 font-semibold text-sm">
              📱 Real-time Scan
            </div>
          </div>
          
          <div className="group text-center p-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-200">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
              🔬
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-4">AI Insights</h4>
            <p className="text-gray-600 leading-relaxed">Machine learning helps identify potential skin conditions and provides recommendations</p>
            <div className="mt-4 text-blue-600 font-semibold text-sm">
              🎯 Smart Analysis
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Tutorial Section Component
  const TutorialSection = () => (
    <section id="tutorial" className="min-h-screen flex flex-col justify-center items-center px-4 py-16">
      <div className="bg-white p-8 mx-8 rounded-xl shadow-lg max-w-5xl w-full border border-blue-100">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-gray-700 to-blue-600 bg-clip-text text-transparent">How to Use Skinalyze</h2>
        
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Upload Your Image</h3>
              <p className="text-gray-600 mb-4">
                Take a clear, well-lit photo of your skin condition or upload an existing image from your device. 
                Make sure the area is visible and the image is in focus.
              </p>
              <div className="bg-gradient-to-r from-white to-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Use natural lighting and avoid shadows for best results.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">AI Analysis</h3>
              <p className="text-gray-600 mb-4">
                Our advanced AI algorithms will analyze your image within seconds, identifying potential skin conditions, 
                analyzing texture, pigmentation, and other important factors.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Processing:</strong> Analysis typically takes 2-5 seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Get Your Results</h3>
              <p className="text-gray-600 mb-4">
                Review your personalized analysis report including potential conditions identified, 
                confidence levels, and recommended next steps or skincare advice.
              </p>
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Remember:</strong> This is for informational purposes only. Consult a dermatologist for medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => scrollToSection('home')}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Try Skinalyze Now
          </button>
        </div>
      </div>
    </section>
  );

  // Main Page Component (Home + About + Features + Tutorial)
  const MainPage = () => (
    <div className="w-full">
      <HomeSection />
      <AboutSection />
      <FeaturesSection />
      <TutorialSection />
    </div>
  );

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-16">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-pink-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => setCurrentView('signup')}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );

  // SignUp Page Component
  const SignUpPage = () => (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-16">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="first-name">First Name</label>
              <input
                id="first-name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="last-name">Last Name</label>
              <input
                id="last-name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a strong password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300" required />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </span>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Account
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentView('login')}
            className="text-blue-600 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-blue-400 rounded-full animate-pulse animation-delay-4000"></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-blue-500 rounded-full animate-pulse animation-delay-6000"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-blue-100">
        <div className="w-full px-12 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-16 w-auto hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <NextImage 
                  src="/LOGO.png" 
                  alt="Skinalyze Logo" 
                  width={200} 
                  height={64} 
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
            <div className="flex space-x-6">
              <NavButton section="home" label="Home" isActive={currentView === 'main' && activeSection === 'home'} />
              <NavButton section="about" label="About" isActive={currentView === 'main' && activeSection === 'about'} />
              <NavButton section="features" label="Features" isActive={currentView === 'main' && activeSection === 'features'} />
              <NavButton section="tutorial" label="Tutorial" isActive={currentView === 'main' && activeSection === 'tutorial'} />
              <ViewButton view="login" label="Login" isActive={currentView === 'login'} />
              <ViewButton view="signup" label="Sign Up" isActive={currentView === 'signup'} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full pt-24">{/* Added padding-top to account for fixed navbar */}
        {currentView === 'main' && <MainPage />}
        {currentView === 'login' && <LoginPage />}
        {currentView === 'signup' && <SignUpPage />}
      </main>
    </div>
  );
}