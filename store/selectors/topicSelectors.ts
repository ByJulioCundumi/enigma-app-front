import { getTopics } from "@/assets/data/topics/topics";
import { IRootState } from "../rootState";

export const selectCurrentTopic = (state: IRootState) => {
  const language = state.language.language;
  const topics = getTopics(language);

  const topicId = state.topics.selectedTopic;

  return topics[topicId] ?? null;
};

export const selectCurrentLevel = (state: IRootState) => {
  const language = state.language.language;
  const topics = getTopics(language);

  const topicId = state.topics.selectedTopic;
  const topic = topics[topicId];

  if (!topic) return null;

  const levelIndex = state.topics.progress[topicId]?.currentLevel ?? 0;

  return topic.levels?.[levelIndex] ?? null;
};