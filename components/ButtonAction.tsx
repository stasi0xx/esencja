import React from 'react';

interface ButtonActionProps {
    text: string;
    onClick?: () => void;
}

const ButtonAction: React.FC<ButtonActionProps> = ({ text, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="relative group inline-block text-xs sm:text-sm font-semibold tracking-wider uppercase text-gray-900 dark:text-white py-2 px-4 focus:outline-none"
        >
            <span className="absolute inset-0 w-full h-full bg-gray-700 dark:bg-gray-300 transition-transform duration-300 ease-out transform scale-y-0 group-hover:scale-y-100 origin-bottom" />
            <span className="absolute inset-0 w-full h-full bg-gray-900 dark:bg-white transition-transform duration-300 ease-out transform scale-y-0 group-hover:scale-y-100 origin-top delay-150" />
            <span className="relative z-10 transition-colors duration-300 ease-out group-hover:text-white dark:group-hover:text-black delay-150">
        {text}
      </span>
        </button>
    );
};

export default ButtonAction;