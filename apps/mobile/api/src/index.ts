import { buildApp } from "./app";
import * as config from "./config";

async function main() {
  const app = buildApp();
  await app.listen({ host: config.host, port: config.port });
}
main();
