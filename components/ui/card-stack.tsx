"use client";
import React from "react";
import { motion } from "framer-motion";

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

interface CardStackProps {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  activeIndex?: number; // indeks sterowany z zewnątrz (opcjonalny)
  defaultIndex?: number; // początkowy indeks w trybie uncontrolled
  onActiveIndexChange?: (index: number) => void; // callback przy zmianie
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

  // Controlled/uncontrolled
  const isControlled = typeof activeIndex === "number";
  const [internalIndex, setInternalIndex] = React.useState(defaultIndex);
  const currentIndex = isControlled ? (activeIndex as number) : internalIndex;

  // Dostosuj indeks, gdy zmienia się długość items (clamp)
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

  // Rotacja widoku względem currentIndex: element o currentIndex jest "na wierzchu"
  const displayCards = React.useMemo(() => {
    if (items.length === 0) return [];
    const start = ((currentIndex % items.length) + items.length) % items.length;
    return [...items.slice(start), ...items.slice(0, start)];
  }, [items, currentIndex]);

  return (
      <div className="relative h-80 w-80 md:h-80 md:w-[28rem]">
        {displayCards.map((card, index) => {
          return (
              <motion.div
                  key={card.id}
                  className={`absolute bg-white dark:bg-neutral-900 h-80 w-80 md:h-80 md:w-[28rem] rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-neutral-800 shadow-black/[0.1] dark:shadow-black/20 flex flex-col justify-between ${
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
                <div className="font-normal text-lg text-gray-700 dark:text-gray-300">
                  {card.content}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {card.name}
                  </p>
                  <p className="text-gray-500 dark:text-neutral-400 font-normal">
                    {card.designation}
                  </p>
                </div>
              </motion.div>
          );
        })}
      </div>
  );
};