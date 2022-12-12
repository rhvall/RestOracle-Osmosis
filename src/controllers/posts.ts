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
    Signature,
    PrivateKey,
    Encoding,
    Poseidon
} from 'snarkyjs';

interface Token {
    price:            number;
    symbol:           string;
    name:             string;
    price_24h_change: number;
    price_7d_change:  number;
}

const env = load({
    ENDPOINT: String,
    PUBLICKEY: String,
    PRIVKEY: String,
    SALT: String
});

// getting prices
const getPrices = async (req: Request, res: Response, next: NextFunction) => 
{
    let result: AxiosResponse = await axios.get(env.ENDPOINT);
    let posts: [Token] = result.data;
    // let zkAppPrivateKey = PrivateKey.random();
    let zkAppPrivateKey = PrivateKey.fromBase58(env.PRIVKEY);
    let zkAppAddress = zkAppPrivateKey.toPublicKey();
    var updated: JSON[] = [];
    posts.forEach(x => {
        try {
            var crypto = {"price": x.price, "symbol": x.symbol};
            // console.log(crypto);
            let cST = Poseidon.hash(Encoding.stringToFields(crypto.toString()));
            let signature = Signature.create(zkAppPrivateKey, cST.toFields());
            var cryptoSS:any = {"price": x.price, "symbol": x.symbol, "signature": signature};
            updated.push(cryptoSS);
        } catch (e) {
            // console.log("JSON: ", x);
            console.log("Error trying to convert to crypto", e);
        }
    });
    
    let cST = Poseidon.hash(Encoding.stringToFields(updated.toString()));
    let rSign = Signature.create(zkAppPrivateKey, cST.toFields());

    let signedPayload = {
        tokens: updated,
        signature: rSign,
        publicKey: zkAppAddress,
    }
    
    return res.status(200).json(signedPayload);
};

export default { getPrices };
