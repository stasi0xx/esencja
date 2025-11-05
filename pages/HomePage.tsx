import React, { useRef, useEffect } from 'react';
import Button from '../components/Button';
import SectionSeparator from '../components/SectionSeparator';
import AnimatedElement from '../components/AnimatedElement';
import { TrendingUp, PenTool, Target } from 'lucide-react';
import AnimatedDots from '../components/AnimatedDots';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ClientLogos from '../components/ClientLogos';

// Fix: Defined a dedicated interface for FeatureCard props for better type checking.
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children, delay = 0 }) => (
    <AnimatedElement
        delay={delay}
        className="group
               border border-gray-200 hover:border-gray-300 dark:border-neutral-800 dark:hover:border-neutral-700
               p-8 rounded-lg
               bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800
               text-center
               shadow-sm hover:shadow-md
               transform-gpu will-change-transform
               hover:scale-[1.03] hover:-translate-y-1
               transition-transform transition-colors transition-shadow duration-500 ease-out
               motion-reduce:transform-none motion-reduce:transition-none"
    >
        <div className="flex justify-center mb-4 transition-colors duration-500 ease-out">
            {icon}
        </div>
        <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white transition-colors duration-500 ease-out">
            {title}
        </h3>
        <p className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed transition-colors duration-500 ease-out">
            {children}
        </p>
    </AnimatedElement>
)



const HomePage = () => {
    const heroRef = useRef<HTMLElement>(null);
    const h1WrapperRef = useRef<HTMLDivElement>(null);
    const pWrapperRef = useRef<HTMLDivElement>(null);
    const buttonWrapperRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const heroElement = heroRef.current;
      if (!heroElement) return;
  
      const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = heroElement.getBoundingClientRect();
        
        // For spotlight gradient on text
        const spotlightX = e.clientX - left;
        const spotlightY = e.clientY - top;
        heroElement.style.setProperty('--spotlight-x', `${spotlightX}px`);
        heroElement.style.setProperty('--spotlight-y', `${spotlightY}px`);
  
        // For parallax
        const parallaxX = (e.clientX - (left + width / 2)) / (width / 2);
        const parallaxY = (e.clientY - (top + height / 2)) / (height / 2);
  
        if (h1WrapperRef.current) {
          h1WrapperRef.current.style.transform = `translateX(${parallaxX * -15}px) translateY(${parallaxY * -15}px)`;
        }
        if (pWrapperRef.current) {
          pWrapperRef.current.style.transform = `translateX(${parallaxX * -8}px) translateY(${parallaxY * -8}px)`;
        }
        if (buttonWrapperRef.current) {
          buttonWrapperRef.current.style.transform = `translateX(${parallaxX * -5}px) translateY(${parallaxY * -5}px)`;
        }
      };
  
      const handleMouseLeave = () => {
          heroElement.style.setProperty('--spotlight-x', `50%`);
          heroElement.style.setProperty('--spotlight-y', `20%`);
          if (h1WrapperRef.current) h1WrapperRef.current.style.transform = `translateX(0px) translateY(0px)`;
          if (pWrapperRef.current) pWrapperRef.current.style.transform = `translateX(0px) translateY(0px)`;
          if (buttonWrapperRef.current) buttonWrapperRef.current.style.transform = `translateX(0px) translateY(0px)`;
      }
  
      heroElement.addEventListener('mousemove', handleMouseMove);
      heroElement.addEventListener('mouseleave', handleMouseLeave);
  
      return () => {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        heroElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="min-h-[calc(100vh-5rem)] container mx-auto px-6 flex flex-col justify-center items-center text-center relative"
      >
        <AnimatedDots />
        
        <div className="relative z-10 flex flex-col items-center">
            <div ref={h1WrapperRef} className="transition-transform duration-300 ease-out will-change-transform">
                <AnimatedElement>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                    Wzmocnij Swoją <span 
                        className="text-transparent bg-clip-text bg-gradient-to-br from-gray-600 to-gray-900 dark:from-gray-400 dark:to-white bg-[length:200%_200%] transition-[background-position] duration-500 ease-out"
                        style={{ backgroundPosition: 'calc(var(--spotlight-x, 50%) * 0.2) calc(var(--spotlight-y, 50%) * 0.2)' }}
                    >Markę</span>
                    </h1>
                </AnimatedElement>
            </div>
            
            <div ref={pWrapperRef} className="transition-transform duration-300 ease-out will-change-transform">
                <AnimatedElement delay={200}>
                    <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-gray-600 dark:text-neutral-400">
                    Esencja to agencja marketingu cyfrowego skoncentrowana na wynikach. Wykorzystujemy strategie oparte na danych i kreatywne kampanie, aby pomóc Ci osiągnąć zrównoważony wzrost.
                    </p>
                </AnimatedElement>
            </div>

            <div ref={buttonWrapperRef} className="transition-transform duration-300 ease-out will-change-transform">
                <AnimatedElement delay={400} className="mt-10">
                    <Button to="/insights" text="Nasze Podejście" />
                </AnimatedElement>
            </div>
        </div>
      </section>

      <SectionSeparator />

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <AnimatedElement className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Dlaczego My?</h2>
            <p className="text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">Łączymy innowacyjną technologię ze sprawdzoną wiedzą marketingową, aby dostarczać wyjątkowe rezultaty.</p>
        </AnimatedElement>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
            <FeatureCard icon={<TrendingUp size={40} className="text-gray-800 dark:text-neutral-200"/>} title="Strategia Oparta na Danych" delay={0}>
                Analizujemy dane rynkowe i zachowania konsumentów, aby tworzyć strategie, które są precyzyzyjne, skuteczne i dostosowane do Twoich celów.
            </FeatureCard>
            <FeatureCard icon={<PenTool size={40} className="text-gray-800 dark:text-neutral-200"/>} title="Kreatywne Kampanie" delay={200}>
                Nasz zespół tworzy fascynujące narracje i oszałamiające wizualizacje, które przyciągają uwagę i rezonują z Twoją publicznością.
            </FeatureCard>
            <FeatureCard icon={<Target size={40} className="text-gray-800 dark:text-neutral-200"/>} title="Mierzalny ROI" delay={400}>
                Skupiamy się na tym, co najważniejsze: dostarczaniu przejrzystych, mierzalnych wyników, które bezpośrednio wpływają na Twój zysk.
            </FeatureCard>
        </div>
      </section>

      <SectionSeparator />

      {/* Client Logos Section */}
      <ClientLogos />
      
      <SectionSeparator />

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <AnimatedElement>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Gotowy na Rozwój?</h2>
            <p className="text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">Porozmawiajmy o tym, jak możemy wzmocnić Twoją markę. Zapoznaj się z naszymi analizami lub skontaktuj się z nami w celu uzyskania spersonalizowanej konsultacji.</p>
            <div className="mt-8">
                <Button to="/insights" text="Przeglądaj Analizy" />
            </div>
        </AnimatedElement>
      </section>
    </div>
  );
};

export default HomePage;