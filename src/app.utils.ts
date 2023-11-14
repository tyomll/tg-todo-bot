export const showList = (todos) =>
  `Your list of todos:\n\n${todos
    .map((todo) => (todo.isCompleted ? "✅" : "❌") + " " + todo.name + "\n\n")
    .join("")}`;
