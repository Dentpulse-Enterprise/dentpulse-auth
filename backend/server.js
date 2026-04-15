import "./src/config/env.js";
import app from "./src/app.js";
import config from "./src/config/index.js";

const { port, host } = config;

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
