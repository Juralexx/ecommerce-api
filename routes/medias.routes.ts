import express, { Request, Response } from 'express'
import FilesModel from '../models/files.model.js';
import { updateImage, upload, uploadImage, uploadImages } from '../controllers/upload.controller.js'
import { deleteMedia } from '../controllers/medias.controller.js'
import { getAll, getOne } from '../controllers/default.controllers.js'

const mediasRoutes = express.Router();

mediasRoutes.post('/upload/single', upload.single('file'), uploadImage);
mediasRoutes.post('/upload/multiple', upload.array('files', 5), uploadImages);
mediasRoutes.put('/:id/update', upload.single('file'), updateImage);

mediasRoutes.get('/', (req: Request, res: Response) => getAll(req, res, FilesModel));
mediasRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, FilesModel));
mediasRoutes.delete('/:id/delete', deleteMedia);

export default mediasRoutes;