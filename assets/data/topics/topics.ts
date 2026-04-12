import { randomLevelsEs } from "./es/randomLevelsEs";
import { randomLevelsEn } from "./en/randomLevelsEn";

export const getTopics = (language: string) => {
  const isEs = language === "es";

  return {
    random: {
      id: "random",
      name: isEs ? "Aleatorio" : "Random",
      levels: isEs ? randomLevelsEs : randomLevelsEn,
    },
  } as const;
};

