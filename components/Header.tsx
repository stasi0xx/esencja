import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import Button from './Button';
import ThemeSwitch from './ThemeSwitch';

// Fix: Defined a dedicated interface for MagneticElement props for better type checking.
interface MagneticElementProps {
  children: React.ReactNode;
}

const MagneticElement = ({ children }: MagneticElementProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.1;
    const y = (clientY - (top + height / 2)) * 0.1;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'translate(0px, 0px)';
    }
  };

  return (
      <div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="transition-transform duration-200 ease-out will-change-transform"
      >
        {children}
      </div>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const headerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = headerContainerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
      `relative text-sm font-medium tracking-wider uppercase transition-colors duration-300 ease-in-out hover:text-gray-900 dark:hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-gray-900 dark:after:bg-white after:origin-left after:transition-transform after:duration-300 ${
          isActive ? 'text-gray-900 dark:text-white after:scale-x-100' : 'text-gray-600 dark:text-neutral-400 after:scale-x-0'
      } hover:after:scale-x-100`;

  const navItems = (
      <>
        <MagneticElement>
          <NavLink to="/" className={navLinkClasses} onClick={() => setIsOpen(false)}>KTO jesteśmy</NavLink>
        </MagneticElement>
        <MagneticElement>
          <NavLink to="/uslugi" className={navLinkClasses} onClick={() => setIsOpen(false)}>CO robimy</NavLink>
        </MagneticElement>
        <MagneticElement>
          <NavLink to="/realizacje" className={navLinkClasses} onClick={() => setIsOpen(false)}>JAK realizujemy</NavLink>
        </MagneticElement>
      </>
  );

  return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
        <div className={`container mx-auto px-6 transition-all duration-300 ease-in-out ${isScrolled ? 'py-2' : 'py-4'}`}>
          <div
              ref={headerContainerRef}
              className={`relative flex items-center justify-between p-4 border border-gray-200/50 dark:border-neutral-800/50 rounded-lg transition-all duration-300 ease-in-out overflow-hidden ${isScrolled ? 'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg shadow-md dark:shadow-2xl' : 'bg-white/70 dark:bg-neutral-950/70 backdrop-blur-lg'}`}
              style={{
                backgroundImage: `radial-gradient(400px at var(--mouse-x, -100%) var(--mouse-y, -100%), rgba(150, 150, 150, 0.1), transparent 80%)`
              }}
          >
            <MagneticElement>
              <Link
                  to="/"
                  className="inline-flex items-center"
                  onClick={() => {
                    // mały timeout, żeby dać routerowi czas na zmianę trasy (lub jej potwierdzenie)
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 0);
                  }}
              >

              <img
                    src="/logo_ese_white.PNG"
                    alt="Logo Esencja"
                    className={`w-auto transition-all duration-300 invert dark:invert-0 ${isScrolled ? 'h-8' : 'h-10'}`}
                    loading="eager"
                    decoding="async"
                />
              </Link>
            </MagneticElement>

            <nav className="hidden md:flex items-center space-x-8">
              {navItems}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <MagneticElement>
                <Button to="/kontakt" text="Twój ruch"/>
              </MagneticElement>
              <ThemeSwitch />
            </div>

            <div className="md:hidden flex items-center gap-2">
              <ThemeSwitch />
              <MagneticElement>
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 dark:text-white focus:outline-none p-2 -m-2">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </MagneticElement>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`transition-all duration-500 ease-in-out md:hidden ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
          <div className="container mx-auto px-6">
            <nav className="flex flex-col items-center space-y-6 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg border border-t-0 border-gray-200 dark:border-neutral-800 rounded-b-lg py-8">
              {navItems}
              <MagneticElement>
                <Button to="/kontakt" text="Twój ruch" onClick={() => setIsOpen(false)}/>
              </MagneticElement>
            </nav>
          </div>
        </div>
      </header>
  );
};

export default Header;