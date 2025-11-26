import React, { useEffect, useState } from 'react';

const ScrollProgressBar: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const total = scrollHeight - clientHeight;
            const value = total > 0 ? (scrollTop / total) * 100 : 0;
            setProgress(value);
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);

        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    return (
        <div className="fixed top-0 right-4 bottom-0 z-[60] pointer-events-none flex items-center">
            {/* Tor paska */}
            <div className="w-1.5 h-[60vh] bg-gray-200/50 dark:bg-black/40 rounded-full relative overflow-hidden shadow-sm">
                {/* Pasek – rośnie od góry do dołu */}
                <div
                    className="absolute top-0 left-0 right-0 bg-gray-900 dark:bg-white transition-[height] duration-75 ease-out"
                    style={{ height: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default ScrollProgressBar;