// Created by rhvall
// GNU GENERAL PUBLIC LICENSE
// Version 3, 29 June 2007

// Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
// Everyone is permitted to copy and distribute verbatim copies
// of this license document, but changing it is not allowed.

// Inspired from: https://www.section.io/engineering-education/how-to-create-a-simple-rest-api-using-typescript-and-nodejs/

import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { load } from 'ts-dotenv';

import {
    SmartContract,
    PublicKey,
    Signature,
    CircuitString,
    PrivateKey,
    Struct,
} from 'snarkyjs';

const crypto = require('crypto');
const SALT = '$ome$altUsedToHmacThingsUp';

interface Crypto
{
    price: Number,
    symbol: String,
    name: String,
    price_24h_change: Number,
    price_7d_change: Number
}

const env = load({
    ENDPOINT: String,
    PUBLICKEY: String,
    PRIVKEY: String
});

// getting prices
const getPrices = async (req: Request, res: Response, next: NextFunction) => 
{
    let result: AxiosResponse = await axios.get(env.ENDPOINT);
    let posts: [Crypto] = result.data;

    // let zkAppPrivateKey = PrivateKey.random();
    let zkAppPrivateKey = PrivateKey.fromBase58(env.PRIVKEY);
    let zkAppAddress = zkAppPrivateKey.toPublicKey();

    let ress = crypto.createHmac('sha256', SALT) 
                     .update(posts.toString())
                     .digest('hex');

    let cST = CircuitString.fromString(ress);

    let rSign = Signature.create(zkAppPrivateKey, cST.toFields());
    // console.log("signature: ", rSign.toJSON());

    let signedPayload = {
        data: posts,
        signature: rSign,
        publicKey: zkAppAddress,
    }
    
    return res.status(200).json(signedPayload);
};

export default { getPrices };
