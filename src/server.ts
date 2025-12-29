import http from "http";
import { env } from "./shared/env";
import { app } from "./app";

const server = http.createServer(app);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${env.PORT}`);
});
