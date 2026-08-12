import "dotenv/config";
import { createServer } from "./server";

const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);

createServer().listen(port, "0.0.0.0", () => {
  console.log(`Knoxit API listening on http://localhost:${port}`);
});
