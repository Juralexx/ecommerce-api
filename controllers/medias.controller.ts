import { Request, Response } from 'express';
import mongoose from 'mongoose';
const ObjectID = mongoose.Types.ObjectId
import FilesModel from '../models/files.model.ts';

import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Delete media
 */

export const deleteMedia = async (req: Request, res: Response) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Unknown ID : ' + req.params.id)
    }

    const { filename } = req.body

    const __directory = `${__dirname}/../uploads`

    const isFile = fs.existsSync(`${__directory}/${filename}`)

    if (isFile) {
        fs.unlink(`${__directory}/${filename}`, (err) => {
            if (err) {
                console.error(err)
            }
        })
    }

    try {
        await FilesModel.findByIdAndDelete({ _id: req.params.id }).exec()
        res.status(200).json({ message: "Successfully deleted." })
    } catch (err) {
        return res.status(400).send({ message: err })
    }
}