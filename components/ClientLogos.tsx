import React, { useRef, useState, useEffect } from 'react'; // DODANO: useState
import { animate } from 'framer-motion';
import AnimatedElement from './AnimatedElement';
import { useClientLogos } from '../hooks/useClientLogos';

interface CounterProps {
    to: number;
}

const Counter: React.FC<CounterProps> = ({ to }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate(0, to, {
                            duration: 2,
                            ease: [0.22, 1, 0.36, 1],
                            onUpdate(value) {
                                node.textContent = Math.round(value).toString();
                            },
                        });
                        observer.unobserve(node);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [to]);

    return <span ref={nodeRef}>0</span>;
};

const ClientLogos = () => {
    const { logos, loading } = useClientLogos();
    // 1. Dodanie stanu do zarządzania pauzą
    const [isPaused, setIsPaused] = useState(false);

    // Duplikacja logotypów dla płynnej pętli
    const extendedLogos = [...logos, ...logos, ...logos, ...logos];

    // 2. Funkcja do przełączania pauzy
    const togglePause = () => {
        setIsPaused(prev => !prev);
    };

    return (
        <section className="container mx-auto px-6 py-16">
            <AnimatedElement className="text-center">
                <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tabular-nums">
                    <Counter to={92} />%
                </h2>
                <p className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 mt-2">
                    Naszych klientów wraca po więcej.
                </p>
                <p className="text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
                    Bo działamy sprawnie, z pomysłem i bez zadęcia. Nie mierzymy się tylko liczbami - ważne są relacja, efekt i satysfakcja.
                </p>
            </AnimatedElement>

            {loading ? (
                <p className="text-center text-gray-500 mt-12">Ładowanie logoów...</p>
            ) : (
                <div
                    // 3. Dodanie obsługi kliknięcia/dotknięcia do kontenera karuzeli
                    onClick={togglePause}
                    className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] mt-12"
                    role="region"
                    aria-label="Loga klientów - karuzela"
                >
                    <ul
                        // 4. Usunięcie problematycznej klasy hover: i zastąpienie jej stylem inline
                        className={`flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll [animation-play-state:running]`}
                        style={{
                            animationPlayState: isPaused ? 'paused' : undefined,
                            cursor: 'pointer' // Wizualna wskazówka, że można kliknąć
                        }}
                    >
                        {extendedLogos
                            .sort((a, b) => a.order - b.order)
                            .map((logo, index) => (
                                <li
                                    key={index}
                                    title={logo.name}
                                    className="h-16 flex items-center justify-center hover:opacity-80 transition-opacity duration-300 flex-shrink-0 cursor-grab active:cursor-grabbing"
                                    role="listitem"
                                >
                                    <img
                                        src={logo.logo_url}
                                        alt={logo.name}
                                        className="max-h-16 max-w-xs object-contain"
                                        loading="lazy"
                                    />
                                </li>
                            ))
                        }
                    </ul>
                </div>
            )}
        </section>
    );
};

export default ClientLogos;