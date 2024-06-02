import {
  createApp,
  createRouter,
  defineEventHandler,
  readRawBody,
  setResponseStatus,
} from "h3";
import { processContent } from "./content.js";

export const app = createApp();
const router = createRouter();
app.use(router);

router.post(
  "/",
  defineEventHandler(async (event) => {
    const binary = await readRawBody(event, "binary");
    if (binary) {
      return processContent(binary);
    } else {
      setResponseStatus(event, 422);
    }
  })
);
