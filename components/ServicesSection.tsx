import React, { useState, useMemo } from 'react';
import { CardStack } from "./ui/card-stack";
import { cn } from "../lib/utils";
import AnimatedElement from './AnimatedElement';
import {
    Palette,
    MonitorSmartphone,
    Lightbulb,
    Printer,
    MousePointerClick,
    Camera,
    PartyPopper,
    HelpCircle,
} from "lucide-react";
import { useCards } from '../hooks/useCards';
import type { CardItem } from '../types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Palette,
    MonitorSmartphone,
    Lightbulb,
    Printer,
    MousePointerClick,
    Camera,
    PartyPopper,
};

const resolveIcon = (iconName: string | null | undefined) => {
    if (!iconName) return HelpCircle;
    return iconMap[iconName] ?? HelpCircle;
};

// Highlight zostaje taki sam jak miałeś:
interface HighlightProps {
    children: React.ReactNode;
    className?: string;
}

export const Highlight = ({ children, className }: HighlightProps) => {
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

const ServicesSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { cards, loading, error } = useCards();

    const stackItems = useMemo(() => {
        if (!cards || cards.length === 0) return [];

        return cards.map((card: CardItem, index) => {
            const Icon = resolveIcon(card.icon ?? null);
            const description = card.description ?? '';

            const start = card.highlight_start ?? null;
            const end = card.highlight_end ?? null;

            let before = description;
            let highlighted = '';
            let after = '';

            if (
                start !== null &&
                end !== null &&
                start >= 0 &&
                end > start &&
                end <= description.length
            ) {
                before = description.slice(0, start);
                highlighted = description.slice(start, end);
                after = description.slice(end);
            }

            return {
                id: index,
                name: card.title ?? 'Bez tytułu',
                designation: card.subtitle ?? '',
                icon: <Icon className="h-10 w-10" />,
                content: (
                    <p>
                        {before}
                        {highlighted && (
                            <Highlight className="mx-1">
                                {highlighted}
                            </Highlight>
                        )}
                        {after}
                    </p>
                ),
            };
        });
    }, [cards]);


    // Gdy nie ma żadnych danych, możesz opcjonalnie użyć fallbackowych lokalnych kart:
    const hasData = stackItems.length > 0;

    return (
        <section className="container mx-auto px-6 py-16">
            <AnimatedElement className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    Jak działamy
                </h2>
                <p className="text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed mt-4">
                    Każdy projekt traktujemy jak wspólną misję. Nasz zespół składa się z
                    ekspertów, którzy odpowiadają za konkretne obszary — od grafiki,
                    przez kampanie online, aż po wydarzenia i branding. Dzięki temu każda
                    część Twojej promocji jest w rękach specjalistów, a cały projekt
                    działa sprawnie i bez niespodzianek.
                </p>
            </AnimatedElement>

            {loading && (
                <p className="text-center text-gray-500 dark:text-neutral-400 mb-8">
                    Ładowanie kart...
                </p>
            )}

            {error && (
                <p className="text-center text-red-500 text-sm mb-8">
                    {error}
                </p>
            )}

            {!loading && !error && !hasData && (
                <p className="text-center text-gray-500 dark:text-neutral-400 mb-8">
                    Brak zdefiniowanych kart. Dodaj je w panelu administratora.
                </p>
            )}

            {hasData && (
                <>
                    <div className="h-[28rem] flex items-center justify-center w-full">
                        <CardStack
                            items={stackItems}
                            activeIndex={activeIndex}
                            onActiveIndexChange={setActiveIndex}
                        />
                    </div>

                    {/* Kropki nawigacyjne pod kartami */}
                    <div
                        className="mt-6 flex items-center justify-center gap-2"
                        aria-label="Nawigacja po kartach"
                    >
                        {stackItems.map((_, i) => (
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
                </>
            )}
        </section>
    );
};

export default ServicesSection;