import { Request, Response } from 'express';
import sharp from 'sharp'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { uploadErrors } from '../errors/uploads.errors.js';
import { randomNbLtID } from '../utils/utils.js';
import FilesModel from '../models/files.model.js';
import multer from 'multer';

//Multer request interface
export interface MulterRequest extends Request {
    file?: any;
    files?: any;
};

const storage = multer.diskStorage({
    //Files destination folder
    //Upload the file to the destination folder
    destination: (req, file, callback) => {
        //callback: (error: Error, destination: string) => void
        callback(null, "./uploads");
    },
    //Filesname
    //Rename files
    filename: (req, file, callback) => {
        //callback: (error: Error, filename: string) => void
        callback(null, file.originalname);
    },
});

/**
 * Validate the files before upload function
 * @param req Express.Request
 * @param file Express.Multer.File
 * @param callback multer.FileFilterCallback
 */
const filterFile = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if (file) {
        //file mimetype
        const mime = file.mimetype;
        //file size
        const fileSize = parseInt(req.headers['content-length']);

        try {
            //Check the mimetype is valid : jpg, jpeg, png
            //If not we return an error
            if (mime !== "image/jpg" && mime !== "image/png" && mime !== "image/jpeg") {
                throw Error("invalid file");
            }
            //(error: null, acceptFile: boolean): void
            callback(null, true);
        } catch (err) {
            //Handle the previous error and return the human readable error
            const errors = uploadErrors(err);
            //We pass the error to the callback
            Object.assign(req, { errors: errors });
            //(error: null, acceptFile: boolean): void
            callback(errors.message);
        }
    }
}

//Multer upload function
//Pass it to filter function, storage and maximum file size
export const upload = multer({
    storage: storage,
    fileFilter: filterFile,
    limits: { fileSize: 2000000 },
});

//Add the error object to express request object
interface FileRequest extends Request {
    errors?: Record<string, string>;
};

/**
 * Upload single image
 */

export const uploadImage = async (req: FileRequest, res: Response) => {
    //Image destination directory
    const __directory = `${__dirname}/../uploads`;

    //If the request contains the error object passed by the 'filterFile' function
    //Return the error to the client
    if (req.errors) {
        return res.status(400).send({ errors: { ...req.errors } });
    }

    //If the request contains a file
    if (req.file) {
        //If the directory do not exists yet, create it
        if (!fs.existsSync(__directory)) {
            fs.mkdirSync(__directory, { recursive: true });
        }

        //For every file to have a unique name
        //Add a random 24 number at the end of the file name
        const filename = `${req.file.originalname.replace(path.extname(req.file.originalname), `-${randomNbLtID(24)}`)}.jpg`;

        //Sharp promise that convert file to 'jpg' and compress it
        const compressAndRename = new Promise((resolve, reject) => {
            //Retrieve the original file
            sharp(`${__directory}/${req.file.originalname}`)
                //Keep metadatas
                .withMetadata()
                //Convert to jpeg
                .jpeg({ mozjpeg: true, quality: 50 })
                //Upload and rename the new file
                .toFile(`${__directory}/${filename}`, (err, info) => {
                    if (err) {
                        console.error('Sharp error : ' + err);
                    } else {
                        resolve(info);
                    }
                });
        });

        //Process compress and rename file
        compressAndRename
            .then(() => {
                //Check if the new file exists
                const isFile = fs.existsSync(`${__directory}/${req.file.originalname}`);

                //If the new file exists
                if (isFile) {
                    //Delete the original file
                    fs.unlink(`${__directory}/${req.file.originalname}`, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    })
                }
            })
            .then(async () => {
                //Add the file information in the database 'Medias' collection
                await FilesModel.create({
                    name: req.file.originalname,
                    path: `/uploads/${filename}`,
                    size: req.file.size,
                    extension: path.extname(filename)
                })
                    .then(docs => {
                        //Send the response to the client
                        return res.send(docs);
                    })
                    .catch(err => {
                        //Handle and return errors
                        const errors = uploadErrors(err);
                        return res.status(200).send({ errors });
                    })
            });
    };
};

/**
 * Upload multiple images
 */

export const uploadImages = async (req: FileRequest, res: Response) => {
    //Image destination directory
    const __directory = `${__dirname}/../uploads`;

    //If the request contains the error object passed by the 'filterFile' function
    //Return the error to the client
    if (req.errors) {
        return res.status(400).send({ errors: { ...req.errors } });
    }

    //If the request contains files and files are a valid array
    if (req.files && Array.isArray(req.files)) {
        //If the directory do not exists yet, create it
        if (!fs.existsSync(__directory)) {
            fs.mkdirSync(__directory, { recursive: true });
        }

        //For each file
        for (let i = 0; i < req.files.length; i++) {
            //Current file
            const file = req.files[i];

            //For every file to have a unique name
            //Add a random 24 number at the end of the file name
            const filename = `${file.originalname.replace(path.extname(file.originalname), `-${randomNbLtID(24)}`)}.jpg`;

            //Sharp promise that convert file to 'jpg' and compress it
            const compressAndRename = new Promise((resolve, reject) => {
                //Retrieve the original file
                sharp(`${__directory}/${file.originalname}`)
                    //Keep metadatas
                    .withMetadata()
                    //Convert to jpeg
                    .jpeg({ mozjpeg: true, quality: 50 })
                    //Upload and rename the new file
                    .toFile(`${__directory}/${filename}`, (err, info) => {
                        if (err) {
                            console.error(err);
                        } else {
                            resolve(info);
                        }
                    })
            })

            //Object containing all the new files documents created in the database
            let response: any[] = [];

            //Process compress and rename file
            compressAndRename
                .then(() => {
                    //Check if the new file exists
                    const isFile = fs.existsSync(`${__directory}/${file.originalname}`);

                    //If the new file exists
                    if (isFile) {
                        //Delete the original file
                        fs.unlink(`${__directory}/${file.originalname}`, (err) => {
                            if (err) {
                                console.error(err);
                            }
                        })
                    }
                })
                .then(async () => {
                    //Add the file information in the database 'Medias' collection
                    await FilesModel.create({
                        name: file.originalname,
                        path: `/uploads/${filename}`,
                        size: file.size,
                        extension: path.extname(filename)
                    })
                        .then(docs => {
                            //Push document to the response object
                            response = [...response, docs];

                            //If the current file is the last file of the array
                            //Send the documents to the client
                            if (i === Number(req.files.length) - 1) {
                                return res.status(200).send(response);
                            }
                        })
                        .catch(err => {
                            //Handle and return errors
                            const errors = uploadErrors(err);
                            return res.status(200).send({ errors });
                        })
                });
        };
    };
};

/**
 * Update image
 */

export const updateImage = async (req: FileRequest, res: Response) => {
    //Image destination directory
    const __directory = `${__dirname}/../uploads`;

    //If the request contains the error object passed by the 'filterFile' function
    //Return the error to the client
    if (req.errors) {
        return res.status(400).send({ errors: { ...req.errors } });
    }

    //If the request contains files
    if (req.file) {
        //If the directory do not exists yet, create it
        if (!fs.existsSync(__directory)) {
            fs.mkdirSync(__directory, { recursive: true });
        }

        //For every file to have a unique name
        //Add a random 24 number at the end of the file name
        const filename = `${req.file.originalname.replace(path.extname(req.file.originalname), `-${randomNbLtID(24)}`)}.jpg`;

        //Sharp promise that convert file to 'jpg' and compress it
        const compressAndRename = new Promise((resolve, reject) => {
            //Retrieve the original file
            sharp(`${__directory}/${req.file.originalname}`)
                //Keep metadatas    
                .withMetadata()
                //Convert to jpeg
                .jpeg({ mozjpeg: true, quality: 50 })
                //Upload and rename the new file
                .toFile(`${__directory}/${filename}`, (err, info) => {
                    if (err) {
                        console.error('Sharp error : ' + err);
                    } else {
                        resolve(info);
                    }
                })
        })

        //Process compress and rename file
        compressAndRename
            .then(() => {
                //Check if the new file exists
                const isFile = fs.existsSync(`${__directory}/${req.file.originalname}`);

                //If the new file exists
                if (isFile) {
                    //Delete the original file
                    fs.unlink(`${__directory}/${req.file.originalname}`, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    })

                    //Get the fileToUpdate object in req.body
                    const { fileToUpdate } = req.body;

                    //If req.body contains fileToUpdate
                    if (fileToUpdate) {
                        //Delete the original file from the directory
                        fs.unlink(`${__directory}/${fileToUpdate}`, (err) => {
                            if (err) {
                                console.error(err);
                            }
                        })
                    }
                }
            })
            .then(async () => {
                //Update the file document in database collection with the new file informations
                await FilesModel.findByIdAndUpdate({
                    _id: req.params.id
                }, {
                    $set: {
                        name: req.file.originalname,
                        path: `/uploads/${filename}`,
                        size: req.file.size,
                        extension: path.extname(filename)
                    },
                }, {
                    new: true,
                    runValidators: true,
                    context: 'query',
                })
                    .then(docs => {
                        //Send the response to the client
                        return res.send(docs);
                    })
                    .catch(err => {
                        //Handle and return errors
                        const errors = uploadErrors(err);
                        return res.status(200).send({ errors });
                    })
            });
    };
};