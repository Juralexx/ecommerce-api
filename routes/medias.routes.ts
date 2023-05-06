import express, { Request, Response } from 'express'
import FilesModel from '../models/files.model.ts';
import { updateImage, upload, uploadImage, uploadImages } from '../controllers/upload.controller.ts'
import { deleteMedia } from '../controllers/medias.controller.ts'
import { getAll, getOne } from '../controllers/default.controllers.ts'

const mediasRoutes = express.Router();

mediasRoutes.get('/', (req: Request, res: Response) => getAll(req, res, FilesModel));
mediasRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, FilesModel));
mediasRoutes.delete('/:id/delete', deleteMedia)

mediasRoutes.post('/upload/single', upload.single('file'), uploadImage);
mediasRoutes.post('/upload/multiple', upload.array('files', 5), uploadImages);
mediasRoutes.put('/:id/update', upload.single('file'), updateImage);

export default mediasRoutes;