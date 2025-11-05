import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import AnimatedElement from './AnimatedElement';

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
              ease: [0.22, 1, 0.36, 1], // easeOutQuint
              onUpdate(value) {
                node.textContent = Math.round(value).toString();
              },
            });
            observer.unobserve(node); // Animate only once
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
  const logotypes = [
    "TechCorp",
    "BuildWell",
    "Industria",
    "Global Ship",
    "AeroFly",
  ];

  return (
    <section className="container mx-auto px-6 py-16">
      <AnimatedElement className="text-center">
        <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tabular-nums">
          <Counter to={92} />%
        </h2>
        <p className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 mt-2">
          Zadowolonych Klientów
        </p>
        <p className="text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
          Jesteśmy dumni z partnerstw, które budujemy. Twoje zaufanie jest naszym największym sukcesem.
        </p>
      </AnimatedElement>
      
      <AnimatedElement delay={200}>
        <div className="mt-12 flex justify-center items-center flex-wrap gap-x-12 gap-y-8">
          {logotypes.map((name) => (
            <div key={name} title={name} className="text-gray-400 dark:text-gray-500 font-bold text-2xl tracking-wider hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300">
              {name}
            </div>
          ))}
        </div>
      </AnimatedElement>
    </section>
  );
};

export default ClientLogos;