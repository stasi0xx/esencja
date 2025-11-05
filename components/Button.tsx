import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  to: string;
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ to, text, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="relative group inline-block text-sm font-semibold tracking-wider uppercase text-gray-900 dark:text-white py-3 px-6 focus:outline-none"
    >
      <span className="absolute inset-0 w-full h-full bg-gray-700 dark:bg-gray-300 transition-transform duration-300 ease-out transform scale-y-0 group-hover:scale-y-100 origin-bottom"></span>
      <span className="absolute inset-0 w-full h-full bg-gray-900 dark:bg-white transition-transform duration-300 ease-out transform scale-y-0 group-hover:scale-y-100 origin-top delay-150"></span>
      <span className="relative z-10 transition-colors duration-300 ease-out group-hover:text-white dark:group-hover:text-black delay-150">
        {text}
      </span>
    </Link>
  );
};

export default Button;