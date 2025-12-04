
import React, { useEffect, useRef } from 'react';
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

            <AnimatedElement delay={200}>
                <div className="mt-12 flex justify-center items-center flex-wrap gap-x-12 gap-y-8">
                    {loading ? (
                        <p className="text-gray-500">Ładowanie logoów...</p>
                    ) : (
                        logos
                            .sort((a, b) => a.order - b.order)
                            .map((logo) => (
                                <div key={logo.id} title={logo.name} className="h-16 flex items-center justify-center hover:opacity-80 transition-opacity duration-300">
                                    <img
                                        src={logo.logo_url}
                                        alt={logo.name}
                                        className="max-h-16 max-w-xs object-contain"
                                    />
                                </div>
                            ))
                    )}
                </div>
            </AnimatedElement>
        </section>
    );
};

export default ClientLogos;