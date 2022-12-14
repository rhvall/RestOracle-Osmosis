// Created by rhvall
// GNU GENERAL PUBLIC LICENSE
// Version 3, 29 June 2007

// Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
// Everyone is permitted to copy and distribute verbatim copies
// of this license document, but changing it is not allowed.

// Inspired from: https://www.section.io/engineering-education/how-to-create-a-simple-rest-api-using-typescript-and-nodejs/

/** source/server.ts */
import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes/posts';

const router: Express = express();

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
router.use('/', routes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 9151;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));


////// endpoints
// https://api-osmosis.imperator.co/tokens/v2/price/osmo
// https://api-osmosis.imperator.co/tokens/v2/price/ion
// https://api-osmosis.imperator.co/tokens/v2/price/wbtc
// {"price":16705.7978968335,"24h_change":-0.9095026643985707}

// https://api-osmosis.imperator.co/tokens/v2/mcap

// https://api-osmosis.imperator.co/tokens/v2/all