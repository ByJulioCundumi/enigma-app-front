import { randomLevelsEs } from "./es/randomLevelsEs";
import { randomLevelsEn } from "./en/randomLevelsEn";

export const getTopics = (language: string) => {
  const isEs = language === "es";

  return {
    random: {
      id: "random",
      name: isEs ? "General" : "General",
      levels: isEs ? randomLevelsEs : randomLevelsEn,
    },
  } as const;
};