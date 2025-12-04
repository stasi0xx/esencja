
"use client";
import React from "react";
import { motion } from "framer-motion";

type Card = {
    id: number;
    name: string;
    designation: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
};

interface CardStackProps {
    items: Card[];
    offset?: number;
    scaleFactor?: number;
    activeIndex?: number;
    defaultIndex?: number;
    onActiveIndexChange?: (index: number) => void;
}

export const CardStack = ({
                              items,
                              offset,
                              scaleFactor,
                              activeIndex,
                              defaultIndex = 0,
                              onActiveIndexChange,
                          }: CardStackProps) => {
    const CARD_OFFSET = offset || 10;
    const SCALE_FACTOR = scaleFactor || 0.06;

    const isControlled = typeof activeIndex === "number";
    const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
    const currentIndex = isControlled ? (activeIndex as number) : internalIndex;

    React.useEffect(() => {
        const max = Math.max(0, items.length - 1);
        if (!isControlled) {
            setInternalIndex((idx) => Math.min(idx, max));
        } else if (typeof activeIndex === "number" && activeIndex > max) {
            onActiveIndexChange?.(max);
        }
    }, [items.length, isControlled, activeIndex, onActiveIndexChange]);

    const setIndex = React.useCallback(
        (next: number) => {
            if (items.length === 0) return;
            const clamped = Math.max(0, Math.min(items.length - 1, next));
            if (!isControlled) setInternalIndex(clamped);
            onActiveIndexChange?.(clamped);
        },
        [isControlled, items.length, onActiveIndexChange]
    );

    const goNext = React.useCallback(() => {
        if (items.length === 0) return;
        const next = (currentIndex + 1) % items.length;
        setIndex(next);
    }, [currentIndex, items.length, setIndex]);

    const displayCards = React.useMemo(() => {
        if (items.length === 0) return [];
        const start = ((currentIndex % items.length) + items.length) % items.length;
        return [...items.slice(start), ...items.slice(0, start)];
    }, [items, currentIndex]);

    return (
        <div className="relative h-80 w-72 sm:w-80 md:h-80 md:w-[28rem]">
            {displayCards.map((card, index) => {
                return (
                    <motion.div
                        key={card.id}
                        className={`absolute h-80 w-72 sm:w-80 md:h-80 md:w-[30rem] rounded-3xl p-6 sm:p-8
                        bg-white dark:bg-neutral-900
                        border border-gray-200 dark:border-neutral-800
                        shadow-sm shadow-black/10 dark:shadow-black/20
                        flex flex-col items-center text-center overflow-hidden
                        ${
                            index === 0 ? "cursor-pointer" : ""
                        }`}
                        style={{
                            transformOrigin: "top center",
                        }}
                        animate={{
                            top: index * -CARD_OFFSET,
                            scale: 1 - index * SCALE_FACTOR,
                            zIndex: displayCards.length - index,
                        }}
                        onClick={index === 0 ? goNext : undefined}
                    >
                        {/* IKONA NA GÓRZE */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex items-center justify-center text-gray-700 dark:text-neutral-200 text-4xl">
                                {card.icon ?? (
                                    <span className="text-2xl font-semibold">
                                        {card.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* NAGŁÓWEK + SUBNAGŁÓWEK */}
                        <div className="mb-4 px-2">
                            <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white break-words">
                                {card.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-1 break-words">
                                {card.designation}
                            </p>
                        </div>

                        {/* CONTENT MNIEJSZĄ CZCIONKĄ */}
                        <div className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-2 overflow-y-auto max-h-32">
                            {card.content}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};