
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Instagram, Phone, Mail } from 'lucide-react';

import SectionSeparator from './SectionSeparator';

// Fix: Defined a dedicated interface for SocialIcon props for better type checking.
interface SocialIconProps {
  href: string;
  children: React.ReactNode;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
      {children}
    </a>
);

const Footer = () => {
  return (
      <footer className="bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-400">
        <SectionSeparator />

        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">

            {/* Social Icons */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Społeczność</h3>
              <div className="flex space-x-6">
                <SocialIcon href="https://www.facebook.com/ESENCJA"><Facebook size={20} /></SocialIcon>
                <SocialIcon href="https://www.instagram.com/esencjareklamy"><Instagram size={20} /></SocialIcon>
                <SocialIcon href="https://www.linkedin.com/company/esencja-kreatorzy-reklamy"><Linkedin size={20} /></SocialIcon>
                <SocialIcon href="https://x.com/esencjaagencja">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694-5.829 6.694h-3.306l7.733-8.835L2.25 2.25h6.675l4.872 6.237 5.517-6.237zM17.15 18.558h1.828L6.122 3.975H4.23l12.92 14.583z"/>
                  </svg>
                </SocialIcon>
              </div>
            </div>

            {/* Contact Phone */}
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Telefon</h3>
              <div className="space-y-2">
                <a href="tel:+48609795999" className="flex items-center justify-center space-x-2 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Phone size={16} />
                  <span>+48 60 979 59 99 (biuro)</span>
                </a>
                <a href="tel:+48601863050" className="flex items-center justify-center space-x-2 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Phone size={16} />
                  <span>+48 601 86 30 50 (kom.)</span>
                </a>
              </div>
            </div>


            {/* Contact Email */}
            <div className="flex flex-col items-center md:items-end">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Email</h3>
              <a href="mailto:agencja@esencja.net" className="flex items-center justify-center md:justify-end space-x-2 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Mail size={16} />
                <span>agencja@esencja.net</span>
              </a>
            </div>

          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-neutral-800 text-center text-sm text-gray-500 dark:text-neutral-400">
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