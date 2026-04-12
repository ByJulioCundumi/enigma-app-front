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

  // 🔥 PROTECCIÓN contra overflow
  if (levelIndex >= topic.levels.length) {
    return topic.levels[topic.levels.length - 1] ?? null;
  }

  return topic.levels[levelIndex] ?? null;
};

export const selectIsTopicCompleted = (state: IRootState) => {
  const topicId = state.topics.selectedTopic;
  const progress = state.topics.progress[topicId];

  const topics = getTopics("es"); // o dinámico
  const totalLevels = topics[topicId]?.levels.length ?? 0;

  return progress.currentLevel >= totalLevels;
};