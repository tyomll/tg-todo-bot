import { Module } from "@nestjs/common";
import { AppUpdate } from "./app.update";
import { AppService } from "./app.service";
import { TelegrafModule } from "nestjs-telegraf";
import * as LocalSession from "telegraf-session-local";
import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot();

const sessions = new LocalSession({ database: "session_db.json" });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.TELEGRAM_TOKEN,
    }),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
