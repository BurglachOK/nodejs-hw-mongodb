import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(
        express.json({
            type: ['application/json', 'application/vnd.api+json'],
            limit: '100kb',
        }),
    );
    app.use(cors());
    app.use(cookieParser());

    app.get('/', (req, res) => {
        res.json({
            message: 'Welcome to contact manager',
        });
    });
    app.use(router);
    app.use('*', notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Time: ${new Date().toLocaleString()}`);
    });
};

