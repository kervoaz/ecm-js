'use strict';

import {textract} from "../technical/AWSClient";
import {Logger} from "../technical/Logger";
import {
    GetDocumentTextDetectionRequest,
    StartDocumentAnalysisResponse,
    StartDocumentTextDetectionRequest
} from "aws-sdk/clients/textract";
import {ECMFile} from "../service/storageService";

export namespace Indexer {
    export async function start(eFile: ECMFile): Promise<StartDocumentAnalysisResponse> {
        // const paramsSync = {//support only pnj jpedg
        //     Document : {
        //         S3Object: {
        //             Bucket: eFile.fileLink.bucket,
        //             Name: eFile.fileLink.objectKey,
        //             Version: eFile.fileLink.versionId
        //         }
        //     }
        // };
        const paramsAsync:StartDocumentTextDetectionRequest = {
            DocumentLocation: { /* required */
                S3Object: {
                    Bucket: eFile.fileLink.bucket,
                    Name: eFile.fileLink.objectKey,
                    Version: eFile.fileLink.versionId
                }
            },
            //,
            // FeatureTypes: [ /* required */
            //     TABLES | FORMS,
            //     /* more items */
            // ],
            // ClientRequestToken: 'DocumentDetectionToken',
            // JobTag: eFile.id

            // NotificationChannel: {
            //     RoleArn: 'arn:aws:sns:eu-west-1:181929501415:AmazonTextract-ecm',//'arn:aws:iam::181929501415:role/ecm-dev-role', /* required */
            //     SNSTopicArn: 'arn:aws:sns:eu-west-1:181929501415:AmazonTextract-ecm' /* required */
            // }
        };
        try {
            const data: StartDocumentAnalysisResponse = await textract.startDocumentTextDetection(paramsAsync).promise();
            Logger.debug(`Job launched: ${JSON.stringify(data)}`);
            return data;
        } catch (err) {
            Logger.error(err, err.stack);
            throw err;
        }
    }

    export async function getResult(jobId:string){
        try{
        const param:GetDocumentTextDetectionRequest={JobId: jobId};
        const data=await textract.getDocumentTextDetection(param).promise();
            Logger.debug(`Job result: ${JSON.stringify(data)}`);
            return data;
        } catch (err) {
            Logger.error(err, err.stack);
            throw err;
        }
    }
}
