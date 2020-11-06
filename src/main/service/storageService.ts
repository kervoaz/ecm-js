'use strict';


import {DocumentRepository} from "../dao/documentDao";
import {MetadataRepository} from "../dao/metadataDao";
import {Indexer} from "../dao/indexerDao";
import {Logger} from "../technical/Logger";

export interface ECMFile {
    id:string;
    docType:DocType;
    fileContent: Buffer;
    metadata: { [key: string]: string };
    fileLink:{bucket:string,objectKey:string,versionId?:string};
    revision:number;
    createdAt?:string;
}

export enum DocType{
    BL='BL',
    INVOICE='INVOICE'
}

export function isVersionnable(docType:DocType){
    if(docType===DocType.BL ){
        return true;
    }else{
        return false;
    }
}

export async function upload(eFile: ECMFile) {
    await DocumentRepository.save(eFile);
    await MetadataRepository.save(eFile);
    const job=await Indexer.start(eFile);
    const res=await Indexer.getResult(job.JobId);
    Logger.deub
}
