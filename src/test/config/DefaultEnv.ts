const envFile = process.env.ENV ? `${process.env.ENV}.env` : 'dev.env';
import * as path from 'path';
import * as dotenv from 'dotenv';

export function parse() {
    console.log('parse', path.resolve(__dirname, `./${envFile}`));
    dotenv.config({path: path.resolve(__dirname, `./${envFile}`)});
}


// Do not remove . Use as static inityalizer
parse();
