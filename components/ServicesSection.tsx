import React, { useState } from 'react';
import { CardStack } from "./ui/card-stack";
import { cn } from "../lib/utils";
import AnimatedElement from './AnimatedElement';

const ServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
      <section className="container mx-auto px-6 py-16">
        <AnimatedElement className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Jak Reagujemy</h2>
          <p className="text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed mt-4">
            Sedno oferty, jej znaczenie w każdej firmie zajmującej się reklamą, marketingiem i promocją jest podobne. My dzielimy nasze obowiązki na obszary, za które odpowiadają wybrani specjaliści.
          </p>
        </AnimatedElement>

        <div className="h-[28rem] flex items-center justify-center w-full">
          <CardStack
              items={CARDS}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
          />
        </div>

        {/* Kropki nawigacyjne pod kartami */}
        <div className="mt-6 flex items-center justify-center gap-2" aria-label="Nawigacja po kartach">
          {CARDS.map((_, i) => (
              <button
                  key={i}
                  type="button"
                  aria-label={`Przejdź do karty ${i + 1}`}
                  aria-current={i === activeIndex ? 'true' : 'false'}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                      "h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-neutral-600",
                      i === activeIndex
                          ? "w-8 bg-gray-900 dark:bg-white"
                          : "w-2.5 bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600"
                  )}
              />
          ))}
        </div>
      </section>
  );
}

// Fix: Defined a dedicated interface for Highlight props for better type checking.
interface HighlightProps {
  children: React.ReactNode;
  className?: string;
}

export const Highlight = ({
                            children,
                            className,
                          }: HighlightProps) => {
  return (
      <span
          className={cn(
              "font-bold text-lg bg-gray-200 text-gray-800 dark:bg-neutral-800 dark:text-neutral-200 px-1 py-0.5 rounded",
              className
          )}
      >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "Projekty graficzne",
    designation: "Design & Branding",
    content: (
        <p>
          Tworzymy spójne wizualnie projekty na potrzeby <Highlight>druku, internetu</Highlight> i reklamy zewnętrznej, które budują silny wizerunek marki.
        </p>
    ),
  },
  {
    id: 1,
    name: "Tworzenie stron www",
    designation: "Web Development",
    content: (
        <p>
          Budujemy nowoczesne <Highlight>strony, serwisy i sklepy online</Highlight>, które są szybkie, responsywne i zoptymalizowane pod kątem konwersji.
        </p>
    ),
  },
  {
    id: 2,
    name: "Koncepcje i strategie",
    designation: "Marketing & Social Media",
    content: (
        <p>
          Opracowujemy <Highlight>kreatywne strategie marketingowe</Highlight> i prowadzimy skuteczne działania w mediach społecznościowych, aby dotrzeć do Twoich klientów.
        </p>
    ),
  },
  {
    id: 3,
    name: "Druk i oznakowanie",
    designation: "Materiały reklamowe",
    content: (
        <p>
          Zapewniamy kompleksową obsługę w zakresie <Highlight>druku materiałów reklamowych</Highlight> oraz profesjonalnego oznakowania pojazdów i obiektów.
        </p>
    ),
  },
  {
    id: 4,
    name: "Kampanie Google Ads",
    designation: "Performance Marketing",
    content: (
        <p>
          Prowadzimy precyzyjnie targetowane <Highlight>kampanie w wyszukiwarce Google</Highlight>, maksymalizując zwrot z inwestycji w reklamę.
        </p>
    ),
  },
  {
    id: 5,
    name: "Sesje fotograficzne",
    designation: "Fotografia produktowa i wizerunkowa",
    content: (
        <p>
          Organizujemy profesjonalne <Highlight>sesje fotograficzne</Highlight>, które podkreślają jakość Twoich produktów i profesjonalizm Twojej firmy.
        </p>
    ),
  },
  {
    id: 6,
    name: "Organizacja imprez",
    designation: "Event Marketing",
    content: (
        <p>
          Specjalizujemy się w organizacji niezapomnianych <Highlight>imprez firmowych</Highlight> i angażujących wydarzeń sportowych.
        </p>
    ),
  },
];

export default ServicesSection;