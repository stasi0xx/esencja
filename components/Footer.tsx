import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import SectionSeparator from './SectionSeparator';

// Fix: Defined a dedicated interface for SocialIcon props for better type checking.
interface SocialIconProps {
  href: string;
  children: React.ReactNode;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
      <SectionSeparator />
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">ESENCJA</h3>
            <p className="text-sm mt-1">Napędzamy wzrost poprzez innowacje.</p>
          </div>
          <div className="flex space-x-6">
            <SocialIcon href="#"><Twitter size={20} /></SocialIcon>
            <SocialIcon href="#"><Github size={20} /></SocialIcon>
            <SocialIcon href="#"><Linkedin size={20} /></SocialIcon>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Esencja. Wszelkie prawa zastrzeżone. Autor Stanisław Korycki</p>
          <div className="mt-2">
            <Link to="/admin" className="hover:underline text-gray-400 dark:text-gray-500 transition-colors">
              Panel Administratora
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;