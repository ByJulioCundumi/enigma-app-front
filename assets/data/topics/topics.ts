import { randomLevelsEs } from "./es/randomLevelsEs";
import { randomLevelsEn } from "./en/randomLevelsEn";
import { animalsLevelsEs } from "./es/animalsLevelsEs";
import { animalsLevelsEn } from "./en/animalsLevelsEn";

export const getTopics = (language: string) => {
  const isEs = language === "es";

  return {
    random: {
      id: "random",
      name: isEs ? "General" : "General",
      levels: isEs ? randomLevelsEs : randomLevelsEn,
    },

    animals: {
      id: "animals",
      name: isEs ? "Animales" : "Animals",
      levels: isEs ? animalsLevelsEs : animalsLevelsEn,
    },
  } as const;
};