import { app } from './app.js';
import { startLogRotationWorker } from './workers/logRotation.worker.js';
import { consoleLogger } from './utils/logger.js';

const PORT = process.env.PORT;

startLogRotationWorker();

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
