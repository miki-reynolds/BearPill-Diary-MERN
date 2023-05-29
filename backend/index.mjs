import 'dotenv/config';
import app from './app.mjs';
import * as logger from './utils/logger.mjs'


const PORT = process.env.PORT;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});