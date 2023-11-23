import { AppService } from "./app.service";
import { Telegraf } from "telegraf";
import {
  Context as Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { actionButtons } from "./app.button";
import { Context } from "./context.interface";
import { showList } from "./app.utils";

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService
  ) {}

  @Start()
  async startCommand(context: Context) {
    await context.reply("Hi friend! 👋");
    await context.reply("What do you want to do?", actionButtons());
  }

  @Hears("📌 Create Task")
  async createTask(context: Context) {
    context.session.type = "create";
    await context.reply("Name the task: ");
  }

  @Hears("📄 Tasks")
  async getAll(context: Context) {
    const todos = await this.appService.getAll();
    await context.reply(showList(todos));
  }

  @Hears("✅ Complete")
  async completeTask(context: Context) {
    await context.reply("Write task ID: ");
    context.session.type = "done";
  }

  @Hears("❌ Delete")
  async deleteTask(context: Context) {
    await context.reply("Write task ID: ");
    context.session.type = "delete";
  }

  @Hears("✏️ Edit")
  async editTask(context: Context) {
    await context.replyWithHTML(
      "Write task ID and new name for task:\n\n " +
        "In this format - <b>1 | New name</b>"
    );
    context.session.type = "edit";
  }

  @On("text")
  async getMessage(@Message("text") message: string, @Ctx() context: Context) {
    if (!context.session.type) return;

    if (context.session.type === "create") {
      const todos = await this.appService.createTask(message);
      await context.reply(showList(todos));
    }

    if (context.session.type === "done") {
      const todos = await this.appService.completeTask(Number(message));

      if (!todos) {
        await context.reply("Task with ID not found!");
        return;
      }

      await context.reply(showList(todos));
    }

    if (context.session.type === "edit") {
      const [taskID, taskName] = message.split("|");

      const todos = await this.appService.editTask(Number(taskID), taskName);

      if (!todos) {
        await context.reply("Task with ID not found!");
        return;
      }

      await context.reply(showList(todos));
    }

    if (context.session.type === "delete") {
      const todos = await this.appService.deleteTask(Number(message));

      if (!todos) {
        await context.reply("Task with ID not found!");
        return;
      }

      await context.reply(
        showList(todos.filter((todo) => todo.id != Number(message)))
      );
    }
  }
}
