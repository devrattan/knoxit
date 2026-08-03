import "dotenv/config";
import { createServer } from "./server";

const port = Number(process.env.API_PORT ?? 4000);

createServer().listen(port, () => {
  console.log(`Knoxit API listening on http://localhost:${port}`);
});
