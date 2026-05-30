import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Features & Tools', path: '/features' },
    { name: 'About TeachSmart', path: '/about' },
    { name: 'Blog & Teacher Resources', path: '/blog' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative overflow-y-auto overflow-x-hidden font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-deep rounded-full blur-[130px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-ghana-gold rounded-full blur-[130px]" />
        <div className="absolute top-[30%] left-[70%] w-[35%] h-[35%] bg-ghana-red rounded-full blur-[150px] opacity-30" />
      </div>

      {/* Reusable Public Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/login" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-deep flex items-center justify-center text-white shadow-md shadow-emerald-900/10 transition-transform group-hover:scale-105">
              <GraduationCap size={20} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800 uppercase block leading-none">
                TeachSmartGH
              </span>
              <span className="text-[7px] font-black uppercase text-emerald-600 tracking-[0.15em] block mt-0.5">
                CATALYST CREATIVE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Link Cluster */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-black uppercase tracking-wider transition-colors py-2 border-b-2 hover:text-emerald-deep ${
                    isActive
                      ? 'text-emerald-deep border-emerald-deep'
                      : 'text-slate-500 border-transparent hover:border-slate-200'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-black uppercase tracking-wider text-slate-600 hover:text-emerald-deep transition-colors bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm"
            >
              Sign In
            </Link>
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-black uppercase tracking-wider text-white bg-emerald-deep hover:bg-emerald-700 transition-all px-5 py-2.5 rounded-xl shadow-md shadow-emerald-950/15"
            >
              Get Started
            </button>
          </div>

          {/* Toggle Hamburger button for mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-emerald-deep transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-6 py-6 absolute w-full left-0 right-0 shadow-lg flex flex-col gap-4 animate-fadeIn">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-xs font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="h-px bg-slate-150 my-2" />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs font-black uppercase tracking-widest text-slate-700 bg-slate-50 border border-slate-200 py-3.5 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs font-black uppercase tracking-widest text-white bg-emerald-deep py-3.5 rounded-xl shadow-md shadow-emerald-950/10"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Render Area */}
      <main className="z-10 relative flex-grow">
        {children}
      </main>

      {/* Elegant Ghanaian Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            {/* About text column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <GraduationCap size={16} />
                </div>
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  TeachSmartGH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
                Supporting the professional growth of Ghanaian educators with secure, intelligent, and curriculum-aligned lesson production technology. Empowering teachers in Accra, Kumasi, Tamale, and beyond.
              </p>
              <div className="flex gap-1">
                <div className="w-6 h-1 rounded-full bg-ghana-red" />
                <div className="w-6 h-1 rounded-full bg-ghana-gold" />
                <div className="w-6 h-1 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Platform Pages</h3>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <Link to="/features" className="hover:text-emerald-400 transition-colors">Platform Features</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-emerald-400 transition-colors">About the Project</Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-emerald-400 transition-colors">Resources & Blog</Link>
                </li>
              </ul>
            </div>

            {/* Curriculum Links Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">GES Standards</h3>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <a href="https://nacca.gov.gh/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">NaCCA Official Portal</a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-emerald-400 transition-colors">Scheme of Learning (SoL)</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-emerald-400 transition-colors">Lesson Note Creator</Link>
                </li>
              </ul>
            </div>

          </div>

          <div className="h-px bg-slate-800 my-6" />

          {/* Under footer segment */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold tracking-wider uppercase">
            <p className="text-slate-500">© {new Date().getFullYear()} TeachSmartGH (Catalyst Creative). Built in Alignment with the National Council for Curriculum and Assessment.</p>
            <div className="flex gap-4">
              <Link to="/login" className="text-slate-500 hover:text-slate-300">Privacy Policy</Link>
              <span className="text-slate-700">|</span>
              <Link to="/login" className="text-slate-500 hover:text-slate-300">Terms of Use</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
