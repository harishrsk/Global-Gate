import Link from "next/link";
import { ShieldCheck, Globe, Zap, ArrowRight, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            G
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">Global-Gate</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors font-bold">Features</a>
          <a href="#onboarding" className="hover:text-indigo-600 transition-colors font-bold">How it Works</a>
          <Link 
            href="/login" 
            className="px-6 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-bold"
          >
            Launch Hub
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-8 animate-fade-in">
          <ShieldCheck size={16} />
          Quantum-Safe Agricultural Intelligence
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl leading-[1.1]">
          The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">International Trade</span> is Agentic.
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
          Global-Gate uses Gemini 1.5 Pro to automate agricultural grading, compliance, and multi-modal verification with Post-Quantum Cryptographic signatures.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-1"
          >
            Enter Dashboard
            <ArrowRight size={20} />
          </Link>
          <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
            View Documentation
          </button>
        </div>

        {/* Layman Explanation Section */}
        <section id="onboarding" className="mt-32 w-full max-w-5xl bg-slate-50 rounded-[3rem] p-12 md:p-20 text-left border border-slate-100">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                New to <span className="text-indigo-600">International Trade?</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Exporting agricultural products is complex. You need to prove quality, meet strict laws, and prevent fraud. Global-Gate makes this easy:
              </p>
              
              <ul className="space-y-6">
                <OnboardingStep 
                  number="1" 
                  title="Upload a Photo" 
                  description="Just take a picture of your product. Our AI (Gemini) acts as a digital inspector." 
                />
                <OnboardingStep 
                  number="2" 
                  title="AI Grading" 
                  description="The system instantly checks for defects and quality, matching them to international laws." 
                />
                <OnboardingStep 
                  number="3" 
                  title="Secure Signing" 
                  description="A human manager reviews the AI's work and signs it with a 'Quantum-Safe' digital seal that cannot be forged." 
                />
              </ul>
            </div>
            <div className="flex-1 bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100">
              <div className="space-y-4">
                <div className="w-full h-48 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={64} className="text-slate-300" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                  <div className="h-4 w-full bg-slate-100 rounded"></div>
                  <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
                </div>
                <div className="pt-4 flex justify-end">
                  <div className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Verify Quality</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-32 w-full">
          <FeatureCard 
            icon={<Globe className="text-indigo-600" size={32} />}
            title="Trade Corridors"
            description="Personalized interests engine tracking specific export routes like Capsicum to UAE."
          />
          <FeatureCard 
            icon={<Zap className="text-emerald-600" size={32} />}
            title="Multimodal AI"
            description="Gemini 1.5 Flash powered visual grading with instant compliance validation."
          />
          <FeatureCard 
            icon={<Shield className="text-indigo-600" size={32} />}
            title="PQC Signatures"
            description="Sovereign security ensuring the integrity of every export report and document."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-400 text-sm">
            © 2024 Global-Gate Systems. Built with Next.js, Prisma, and Gemini 1.5.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm font-medium">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Audit Logs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OnboardingStep({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <li className="flex gap-4">
      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
    </li>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-3xl text-left hover:border-indigo-100 hover:shadow-xl transition-all duration-300 group">
      <div className="mb-6 p-3 bg-slate-50 rounded-2xl w-fit group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
