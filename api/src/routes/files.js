const { s3UploadFile, s3DownloadFile } = require('../s3/s3-service');


removeFile = (req, res) => {
    // Do not allow users to delete file, just return an "ok".
    const fileId = req.params.fileId;
    res.status(200).json({"fileId": fileId});
}
getFile = async (req, res) => {
    const fileId = req.params.fileId;
    const s3Response = await s3DownloadFile(fileId);

    res.setHeader('Content-Type', s3Response.headers['content-type'])
        .setHeader('Content-disposition', 'attachment;filename=' + req.query.originalName)
        .setHeader('Content-Length', s3Response.data.length)
        .send(Buffer.from(s3Response.data, 'binary'))
}
uploadFile = async (req, res) => {
    const fileData = req.files.file.data;
    const fileOriginalName = req.files.file.name; // original name
    const fileSize = req.files.file.size;
    const fileMimetype = req.files.file.mimetype;
    const fileS3Name = req.body.name; // to be sent to s3
    
    console.log('file.js Received Request to upload a file -',  fileS3Name);

    try {
        const s3Resp = await s3UploadFile(fileS3Name, 
                                    fileData, 
                                    fileSize, 
                                    fileMimetype);
    console.log('file.js upload file before completion');
    } catch (error) {
         console.log('file.js upload catch block");        
        res.status(500).send("Error while uploading file.");
    }
    console.log('file.js upload file completed');
    res.status(201).json({
        "status": "Ok",
        "url": `https://${req.headers.host}/api/v1/files/${fileS3Name}?originalName=${fileOriginalName}`
    });
};
module.exports = {
    uploadFile,
    getFile,
    removeFile
}
