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
      image: require("@/assets/images/topics/random.jpg")
    },

    animals: {
      id: "animals",
      name: isEs ? "Animales" : "Animals",
      levels: isEs ? animalsLevelsEs : animalsLevelsEn,
      image: require("@/assets/images/topics/animals.jpg")
    },

    space: {
      id: "space",
      name: isEs ? "Espacio" : "Space",
      levels: isEs ? spaceLevelsEs : spaceLevelsEn,
      image: require("@/assets/images/topics/space.jpg")
    },

    superpowers:{ 
      id: "superpowers",
      name: isEs ? "Superpoderes" : "Superpowers",
      levels: isEs ? superpowersLevelsEs : superpowersLevelsEn,
      image: require("@/assets/images/topics/superpowers.jpg")
    },
  } as const;
};

