import 'dotenv/config';
import app from "./app.js";
import config from "./core/config/index.js";

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});