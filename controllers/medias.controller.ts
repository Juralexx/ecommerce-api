import { Request, Response } from 'express';
import mongoose from 'mongoose';
const ObjectID = mongoose.Types.ObjectId
import FilesModel from '../models/files.model.js';

import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Delete media
 */

export const deleteMedia = async (req: Request, res: Response) => {
    //Check if the id params is a valide MongoDB ID
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Unknown ID : ' + req.params.id)
    }

    //Body request destructuration
    const { filename } = req.body

    //'uploads' directory path
    const __directory = `${__dirname}/../uploads`

    //Check that the file exists
    const isFile = fs.existsSync(`${__directory}/${filename}`)

    //If it exists
    if (isFile) {
        //Delete it
        fs.unlink(`${__directory}/${filename}`, (err) => {
            if (err) {
                console.error(err)
            }
        })
    }

    //Process deletion in database
    try {
        await FilesModel
            .findByIdAndDelete({ _id: req.params.id })
            .exec()

        res.status(200).json({ message: "Successfully deleted." })
    } catch (err) {
        return res.status(400).send({ message: err })
    }
}