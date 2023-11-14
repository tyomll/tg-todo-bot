import { Markup } from "telegraf";

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback("📄 Tasks", "list"),
      Markup.button.callback("✏️ Edit task", "edit"),
      Markup.button.callback("❌ Delete task", "delete"),
    ],
    {
      columns: 1,
    }
  );
}
