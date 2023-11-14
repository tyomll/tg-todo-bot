import { AppService } from "./app.service";
import { Context, Telegraf } from "telegraf";
import { InjectBot, Start, Update } from "nestjs-telegraf";
import { actionButtons } from "./app.button";

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
}
