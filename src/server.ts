import app from "./app";
import {env} from './config/config';
const PORT = env.port || 5000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
