"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  const handleCardFlip = () => {
    setCards((prevCards) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()!);
      return newArray;
    });
  };

  return (
    <div className="relative h-80 w-80 md:h-80 md:w-[28rem]">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className={`absolute bg-white dark:bg-gray-800 h-80 w-80 md:h-80 md:w-[28rem] rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 shadow-black/[0.1] dark:shadow-black/20 flex flex-col justify-between ${
              index === 0 ? 'cursor-pointer' : ''
            }`}
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
            onClick={index === 0 ? handleCardFlip : undefined}
          >
            <div className="font-normal text-lg text-gray-700 dark:text-gray-300">
              {card.content}
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                {card.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400 font-normal">
                {card.designation}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};