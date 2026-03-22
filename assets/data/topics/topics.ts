import { randomLevelsEs } from "./es/randomLevelsEs";
import { randomLevelsEn } from "./en/randomLevelsEn";
import { animalsLevelsEs } from "./es/animalsLevelsEs";
import { animalsLevelsEn } from "./en/animalsLevelsEn";
import { spaceLevelsEs } from "./es/spaceLevelsEs";
import { spaceLevelsEn } from "./en/spaceLevelsEn";
import { superpowersLevelsEn } from "./en/superpowersLevelsEn";
import { superpowersLevelsEs } from "./es/superpowersLevelsEs";

export const getTopics = (language: string) => {
  const isEs = language === "es";

  return {
    random: {
      id: "random",
      name: isEs ? "Aleatorio" : "Random",
      levels: isEs ? randomLevelsEs : randomLevelsEn,
    },

    animals: {
      id: "animals",
      name: isEs ? "Animales" : "Animals",
      levels: isEs ? animalsLevelsEs : animalsLevelsEn,
    },

    space: {
      id: "space",
      name: isEs ? "ESPACIO" : "SPACE",
      levels: isEs ? spaceLevelsEs : spaceLevelsEn,
    },

    superpowers:{ 
      id: "superpowers",
      name: isEs ? "SUPERPODERES" : "SUPERPOWERS",
      levels: isEs ? superpowersLevelsEs : superpowersLevelsEn,
    },
  } as const;
};

