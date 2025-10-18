"use client";

import { useState } from "react";

// If you later use images, re-enable the import below
// import Image from "next/image";

// Union type for safer section navigation
type Section = "home" | "about" | "tutorial" | "Login" | "SignUp";

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("home");

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId as Section);
    }
  };

  const NavButton = ({ section, label, isActive }: { section: Section; label: string; isActive: boolean }) => (
    <button
      onClick={() => scrollToSection(section)}
      className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 ${
        isActive
          ? "text-black border-b-4 border-black"
          : "text-blue-600 hover:text-black"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );

  // Home Section Component
  const HomeSection = () => (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
          Skinalyze
        </h1>
        <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
          AI-powered skin disease detection through image analysis. Upload a photo or use your camera to get instant skin condition insights
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => scrollToSection('about')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors"
          >
            Learn More
          </button>
          <button 
            onClick={() => scrollToSection('tutorial')}
            className="bg-white text-pink-600 border-2 border-pink-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-50 transition-colors"
          >
            View Tutorial
          </button>
        </div>
      </div>
    </section>
  );

  // About Section Component  
  const AboutSection = () => (
    <section id="about" className="min-h-screen flex flex-col justify-center items-center px-4 py-16">
      <div className="bg-white p-8 mx-8 rounded-xl shadow-lg mb-16 max-w-5xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">About Skinalyze</h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-pink-600">🎯 Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              We&apos;re democratizing access to skin health insights through cutting-edge AI technology.
              Our mission is to provide early detection and awareness of skin conditions, making dermatological
              screening accessible to everyone, anywhere.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-600">🧠 How It Works</h3>
            <p className="text-gray-600 leading-relaxed">
              Using advanced machine learning algorithms trained on thousands of dermatological images,
              Skinalyze can identify potential skin conditions, analyze skin health, and provide
              personalized recommendations for skincare and medical consultation.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-pink-50 rounded-lg">
            <div className="text-3xl mb-3">📸</div>
            <h4 className="font-semibold text-gray-800 mb-2">Image Analysis</h4>
            <p className="text-sm text-gray-600">Upload photos for instant AI-powered skin condition analysis</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-3">📷</div>
            <h4 className="font-semibold text-gray-800 mb-2">Camera Detection</h4>
            <p className="text-sm text-gray-600">Use your device camera for real-time skin health monitoring</p>
          </div>
          <div className="text-center p-6 bg-indigo-50 rounded-lg">
            <div className="text-3xl mb-3">🔬</div>
            <h4 className="font-semibold text-gray-800 mb-2">AI Insights</h4>
            <p className="text-sm text-gray-600">Machine learning helps identify potential skin conditions</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">🚀 Built for HackKnight Fall 2025</h3>
          <p className="text-gray-600 leading-relaxed">
            Skinalyze was developed during HackKnight Fall 2025, leveraging modern web frameworks like Next.js, React, and Tailwind CSS.
            Our mission is to democratize dermatological insights through accessible AI-powered skin health analysis.
          </p>
        </div>
      </div>
    </section>
  );

  // Tutorial Section Component
  const TutorialSection = () => (
    <section id="tutorial" className="min-h-screen flex flex-col justify-center items-center px-4 py-16">
      <div className="bg-white p-8 mx-8 rounded-xl shadow-lg max-w-5xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">How to Use Skinalyze</h2>
        
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Upload Your Image</h3>
              <p className="text-gray-600 mb-4">
                Take a clear, well-lit photo of your skin condition or upload an existing image from your device. 
                Make sure the area is visible and the image is in focus.
              </p>
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-pink-700">
                  <strong>Tip:</strong> Use natural lighting and avoid shadows for best results.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">AI Analysis</h3>
              <p className="text-gray-600 mb-4">
                Our advanced AI algorithms will analyze your image within seconds, identifying potential skin conditions, 
                analyzing texture, pigmentation, and other important factors.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-700">
                  <strong>Processing:</strong> Analysis typically takes 2-5 seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Get Your Results</h3>
              <p className="text-gray-600 mb-4">
                Review your personalized analysis report including potential conditions identified, 
                confidence levels, and recommended next steps or skincare advice.
              </p>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700">
                  <strong>Remember:</strong> This is for informational purposes only. Consult a dermatologist for medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => scrollToSection('home')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors"
          >
            Try Skinalyze Now
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="w-full px-12 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <span className="text-3xl font-bold text-gray-800">Skinalyze</span>
            </div>
            <div className="flex space-x-6">
              <NavButton section="home" label="Home" isActive={activeSection === 'home'} />
              <NavButton section="about" label="About" isActive={activeSection === 'about'} />
              <NavButton section="tutorial" label="Tutorial" isActive={activeSection === 'tutorial'} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - All sections on one page */}
      <main className="w-full">
        <HomeSection />
        <AboutSection />
        <TutorialSection />
      </main>
    </div>
  );
}