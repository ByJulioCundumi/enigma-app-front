import { randomLevels } from "./randomLevels";
import { animalsLevels } from "./animalsLevels";

export const topics = {
  random: {
    id: "random",
    name: "Aleatorio",
    levels: randomLevels,
  },

  animals: {
    id: "animals",
    name: "Animales",
    levels: animalsLevels,
  },
} as const;