'use strict';


import {DocumentRepository} from "../dao/documentDao";
import {MetadataRepository} from "../dao/metadataDao";
import {Indexer} from "../dao/indexerDao";
import {Logger} from "../technical/Logger";
import axios from "axios";
axios.defaults.adapter = require('axios/lib/adapters/http');

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
/*
PUT _ingest/pipeline/attachment
{
  "description" : "Extract attachment information",
  "processors" : [
    {
      "attachment" : {
        "field" : "data"
      },
      "remove": {
        "field": "data"
      }
    }
  ]
}
*/
export async function attachment(eFile: ECMFile) {
    const adapter = require('axios/lib/adapters/http');
    const b64=eFile.fileContent.toString('base64');
    const config={maxContentLength: Infinity,
        maxBodyLength: Infinity,}
   await axios.post(`http://localhost:9200/my-index-000001/_doc/${eFile.id}?pipeline=attachment`,{data:b64},config);
}

const query={
    query: {
      match_phrase: { "attachment.content": "BRD-BPTU-0715" }
    },
    _source:false,
    highlight: {
        number_of_fragments : 20,
      fragment_size : 150,
      fields: {
        "attachment.content": {}
      }
    }
  }

  export async function findInAttachment(stringToSearch: string):Promise<any> {
      query.query.match_phrase["attachment.content"]=stringToSearch;
    const adapter = require('axios/lib/adapters/http');
    const config={maxContentLength: Infinity,
        maxBodyLength: Infinity,}
  return await axios.post(`http://localhost:9200/my-index-000001/_search`,query,config);
}