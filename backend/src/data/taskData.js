const attributeOrder = ["intelligence", "health", "money"];

export let levelThresholds = [
  { max: 34, level: "bad" },
  { max: 69, level: "average" },
  { max: 89, level: "good" },
  { max: Number.POSITIVE_INFINITY, level: "excellent" },
];

export const baseTaskState = {
  taskId: "gym-training-001",
  title: "Task In Progress",
  description:
    "You are at the gym, sweating through your workout. The session helps relieve your stress and gives both your stamina and physical condition a steady boost.",
  attributes: {
    intelligence: 50,
    health: 50,
    money: 50,
  },
  options: [
    {
      id: "leave",
      text: "Go Home",
      effects: {
        intelligence: 0,
        health: -2,
        money: 0,
      },
    },
    {
      id: "train",
      text: "Keep Training",
      effects: {
        intelligence: 0,
        health: 8,
        money: -3,
      },
    },
  ],
};

function getLevel(value, thresholds = levelThresholds) {
  return thresholds.find((item) => value <= item.max)?.level ?? "average";
}

function clampStat(value) {
  return Math.max(0, Math.min(100, value));
}

export function buildTaskResponse(state, thresholds = levelThresholds) {
  return {
    taskId: state.taskId,
    title: state.title,
    description: state.description,
    attributes: attributeOrder.map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      icon: key === "intelligence" ? "I" : key === "health" ? "H" : "M",
      level: getLevel(state.attributes[key], thresholds),
      value: state.attributes[key],
    })),
    options: state.options.map(({ id, text }) => ({ id, text })),
  };
}

export function applyTaskChoice(choiceId, state, thresholds = levelThresholds) {
  const option = state.options.find((item) => item.id === choiceId);

  if (!option) {
    return null;
  }

  const updatedAttributes = Object.fromEntries(
    attributeOrder.map((key) => [
      key,
      clampStat(state.attributes[key] + (option.effects[key] ?? 0)),
    ]),
  );

  return {
    taskId: state.taskId,
    selectedOptionId: option.id,
    selectedOptionText: option.text,
    effects: option.effects,
    nextState: buildTaskResponse({ ...state, attributes: updatedAttributes }, thresholds),
  };
}
