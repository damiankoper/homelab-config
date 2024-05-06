import { createApp, createRouter, defineEventHandler, readBody } from "h3";
import { importResult } from "./process.js";
import * as api from "@actual-app/api";
import { z } from "zod";

export const app = createApp();

const EnvSchema = z.object({
  SERVER_URL: z.string().url(),
  SERVER_PASSWORD: z.string().min(1),
  BUDGET_SYNC_ID: z.string().uuid(),
});
const env = EnvSchema.parse(process.env);

async function bootstrap() {
  console.log(env);

  await api.init({
    dataDir: "./data",
    serverURL: env.SERVER_URL,
    password: env.SERVER_PASSWORD,
  });
  await api.downloadBudget(env.BUDGET_SYNC_ID);

  const router = createRouter();
  app.use(router);

  router.post(
    "/",
    defineEventHandler(async (event) => {
      return importResult(await readBody(event));
    })
  );
}
bootstrap();
