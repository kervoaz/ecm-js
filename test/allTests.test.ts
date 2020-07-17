'use strict';


import * as DefaultEnv from '../test/config/DefaultEnv';
import {DocType, upload} from "../service/storageService";
import * as fs from "fs";
import {Indexer} from "../dao/indexerDao";

DefaultEnv.parse();

test('storageService', async () => {
    await upload({
        fileLink:{bucket:'create-by-api',objectKey: '2020/08/toto.pdf'},
        docType: DocType.BL,
        id: "Bl1#INV1",
        fileContent: fileNameToBuffer("Taster Sessions Présentation et liens d'enregistrement1.pdf"),
        metadata: {'xBLNUM': 'bl1', 'xINVNO': 'inv1'},
        revision:1
    });
    await upload({
        fileLink:{bucket:'create-by-api',objectKey: '2020/08/toto.pdf'},
        docType: DocType.BL,
        id: "Bl1#INV1",
        fileContent: fileNameToBuffer("Taster Sessions Présentation et liens d'enregistrement1.pdf"),
        metadata: {'xBLNUM': 'bl1', 'xINVNO': 'inv1'},
        revision:2
    });
    expect(true).toBe(true);
}, 90000);

test('getResult', async () => {
    await Indexer.getResult('9fa14d82af72b83984ea3eabdd3831ff93fd710332fb42ecb23b70fea7a613f1');
},90000);

function fileNameToBuffer(fileName: string):Buffer {
    const curDir = __dirname.substr(0, __dirname.lastIndexOf("\\test"));
    let rawdata = fs.readFileSync(curDir + '/test/resources/' + fileName);
    return rawdata;//Buffer.from(rawdata);
}


