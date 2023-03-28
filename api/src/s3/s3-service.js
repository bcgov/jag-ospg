const aws4  = require('aws4');
const axios = require('axios');
require('dotenv').config();

const BUCKETNAME = process.env.S3_BUCKETNAME;
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const HOST = process.env.S3_HOST;

function signRequest(method, s3FileName) {
    let opts = { 
        host: HOST, 
        path: `/${BUCKETNAME}/${s3FileName}`,
        method // <<<---- VERY IMPORTANT TO BE IN CAPITALS!!!
    };
    console.log('Received Request to sign upload request - ',s3FileName);
    aws4.sign(opts, { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY });
    return opts;
}

const s3UploadFile = async (fileS3Name, 
                            fileData, 
                            fileSize, 
                            fileMimetype) => {
    const s3Signature = signRequest('PUT', fileS3Name);
    console.log('Received Request to upload file ',fileS3Name);
    const headers = {
        'X-Amz-Date': s3Signature.headers['X-Amz-Date'],
        'Authorization': s3Signature.headers.Authorization,
        'Content-Length': fileSize,
        'Content-Type': fileMimetype,
    }

    try {
       console.log('s3-srvice.js calling axios');
        const resp = await axios({
            method: 'put',
            url: `https://${HOST}/${BUCKETNAME}/${fileS3Name}`,
            headers,
            data: fileData
        });
     console.log('File uploaded  and response is - ',resp);
        return resp;
    } catch (error) {
        console.log('s3-service.js axios call failed');
        console.log('s3-service.js axios call failed error toJSON()',error.toJSON());
        if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
         console.log('s3-service.js axios call failure end');
        throw error;
    }
}

const s3DownloadFile = async (fileS3Name) => {
    const s3Signature = signRequest('GET', fileS3Name);
    
    const headers = {
        'X-Amz-Date': s3Signature.headers['X-Amz-Date'],
        'Authorization': s3Signature.headers.Authorization,
        'Accept': 'application/octet-stream'
    }

    try {
        const resp = await axios({
            method: 'get',
            url: `https://${HOST}/${BUCKETNAME}/${fileS3Name}`,
            headers,
            responseType: 'arraybuffer'
        });
        return resp;
    } catch (error) {
        console.log(error.response.data)
        throw error
    }
}
module.exports = {
    s3UploadFile,
    s3DownloadFile
}
