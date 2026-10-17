import { app } from "./app.js";
import { env } from "./config/env.js";
import { initStorage } from "./services/storage.service.js";
async function bootstrap() {
  await initStorage();
  app.listen(env.PORT, () => console.log("API on " + env.PORT));
}

bootstrap().catch((error) => {
  console.error("Unable to start server", error);
  process.exitCode = 1;
});
