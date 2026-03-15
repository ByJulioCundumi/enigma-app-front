import { randomLevels } from "./randomLevels";
import { animalsLevels } from "./animalsLevels";

export const topics = {
  random: {
    id: "random",
    name: "Al azar",
    levels: randomLevels,
  },

  animals: {
    id: "animals",
    name: "Animales",
    levels: animalsLevels,
  },
} as const;