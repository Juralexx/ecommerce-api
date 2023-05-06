import { Request, Response } from 'express';
import sharp from 'sharp'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { uploadErrors } from '../errors/uploads.errors.ts';
import { randomNbLtID } from '../utils/utils.js';
import FilesModel from '../models/files.model.ts';
import multer from 'multer';

import mongoose from 'mongoose';
import { FileFilterCallback } from 'multer';
const ObjectID = mongoose.Types.ObjectId

export interface MulterRequest extends Request {
    file?: any;
    files?: any;
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});

const filterFile = (req: Request, res: Express.Multer.File, callback: FileFilterCallback) => {
    if (res) {
        const mime = res.mimetype
        const fileSize = parseInt(req.headers['content-length'])

        try {
            if (mime != "image/jpg" && mime != "image/png" && mime != "image/jpeg") {
                throw Error("invalid file");
            }
            callback(null, true);
        } catch (err) {
            const errors = uploadErrors(err);
            Object.assign(req, { errors: errors })
            return callback(errors.message);
        }
    }
}

export const upload = multer({
    fileFilter: filterFile,
    storage: storage,
    limits: { fileSize: 2000000 },
})

interface FileRequest extends Request {
    errors?: Record<string, string>
}

/**
 * Upload single image
 */

export const uploadImage = async (req: FileRequest, res: Response) => {
    const __directory = `${__dirname}/../uploads`

    if (req.errors) {
        return res.status(400).send({ errors: { ...req.errors } })
    }

    if (req.file) {
        if (!fs.existsSync(__directory)) {
            fs.mkdirSync(__directory, { recursive: true })
        }

        const filename = `${req.file.originalname.replace(path.extname(req.file.originalname), `-${randomNbLtID(24)}`)}.jpg`

        const promise = new Promise((resolve, reject) => {
            sharp(`${__directory}/${req.file.originalname}`)
                .withMetadata()
                .jpeg({ mozjpeg: true, quality: 50 })
                .toFile(`${__directory}/${filename}`, (err, info) => {
                    if (err) {
                        console.error('Sharp error : ' + err)
                    } else {
                        resolve(info)
                    }
                })
        })

        promise
            .then(() => {
                const isFile = fs.existsSync(`${__directory}/${req.file.originalname}`)

                if (isFile) {
                    fs.unlink(`${__directory}/${req.file.originalname}`, (err) => {
                        if (err) {
                            console.error(err)
                        }
                    })
                }
            })
            .then(async () => {
                await FilesModel.create({
                    name: req.file.originalname,
                    path: `/uploads/${filename}`,
                    size: req.file.size,
                    extension: path.extname(filename)
                })
                    .then(docs => {
                        return res.send(docs)
                    })
                    .catch(err => {
                        const errors = uploadErrors(err);
                        return res.status(200).send({ errors })
                    })
            })
    }
}

/**
 * Upload multiple images
 */

export const uploadImages = async (req: FileRequest, res: Response) => {
    const __directory = `${__dirname}/../uploads`

    if (req.errors) {
        return res.status(400).send({ errors: { ...req.errors } })
    }

    if (req.files && Array.isArray(req.files)) {
        if (!fs.existsSync(__directory)) {
            fs.mkdirSync(__directory, { recursive: true })
        }

        let response: any[] = []

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i]
            
            const filename = `${file.originalname.replace(path.extname(file.originalname), `-${randomNbLtID(24)}`)}.jpg`

            const promise = new Promise((resolve, reject) => {
                sharp(`${__directory}/${file.originalname}`)
                    .withMetadata()
                    .jpeg({ mozjpeg: true, quality: 50 })
                    .toFile(`${__directory}/${filename}`, (err, info) => {
                        if (err) {
                            console.error(err)
                        } else {
                            resolve(info)
                        }
                    })
            })

            promise
                .then(() => {
                    const isFile = fs.existsSync(`${__directory}/${file.originalname}`)

                    if (isFile) {
                        fs.unlink(`${__directory}/${file.originalname}`, (err) => {
                            if (err) {
                                console.error(err)
                            }
                        })
                    }
                })
                .then(async () => {
                    await FilesModel.create({
                        name: file.originalname,
                        path: `/uploads/${filename}`,
                        size: file.size,
                        extension: path.extname(filename)
                    })
                        .then(docs => {
                            response = [...response, docs]

                            if (i === Number(req.files.length) - 1) {
                                return res.status(200).send(response)
                            }
                        })
                        .catch(err => {
                            const errors = uploadErrors(err);
                            return res.status(200).send({ errors })
                        })
                })
        }
    }
}

/**
 * Update image
 */

export const updateImage = async (req: FileRequest, res: Response) => {
    const __directory = `${__dirname}/../uploads`

    if (req.errors) {
        return res.status(400).send({ errors: { ...req.errors } })
    }

    if (req.file) {
        if (!fs.existsSync(__directory)) {
            fs.mkdirSync(__directory, { recursive: true })
        }

        const filename = `${req.file.originalname.replace(path.extname(req.file.originalname), `-${randomNbLtID(24)}`)}.jpg`

        const promise = new Promise((resolve, reject) => {
            sharp(`${__directory}/${req.file.originalname}`)
                .withMetadata()
                .jpeg({ mozjpeg: true, quality: 50 })
                .toFile(`${__directory}/${filename}`, (err, info) => {
                    if (err) {
                        console.error('Sharp error : ' + err)
                    } else {
                        resolve(info)
                    }
                })
        })

        promise
            .then(() => {
                const isFile = fs.existsSync(`${__directory}/${req.file.originalname}`)

                if (isFile) {
                    fs.unlink(`${__directory}/${req.file.originalname}`, (err) => {
                        if (err) {
                            console.error(err)
                        }
                    })

                    const { fileToUpdate } = req.body

                    if (fileToUpdate) {
                        fs.unlink(`${__directory}/${fileToUpdate}`, (err) => {
                            if (err) {
                                console.error(err)
                            }
                        })
                    }
                }
            })
            .then(async () => {
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
                        return res.send(docs)
                    })
                    .catch(err => {
                        const errors = uploadErrors(err);
                        return res.status(200).send({ errors })
                    })
            })
    }
}