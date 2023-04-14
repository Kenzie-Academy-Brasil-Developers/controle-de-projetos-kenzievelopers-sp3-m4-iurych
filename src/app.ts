import express, { Application } from 'express';
import 'dotenv/config';
import {
  createDeveloper,
  deleteDeveloper,
  retrieveDevById,
  updateDeveloper,
} from './logics/developer.logic';
import {
  verifyDevAlreadyExistsMiddleware,
  verifyDevIdMid,
} from './middlewares/developers.middlewares';
import { createDevInfo } from './logics/developerInfo.logic';
import { verifyInfoAlreadyExistsMid } from './middlewares/developer.info';

const app: Application = express();
app.use(express.json());

app.post('/developers', verifyDevAlreadyExistsMiddleware, createDeveloper);
app.get('/developers/:id', verifyDevIdMid, retrieveDevById);
app.patch(
  '/developers/:id',
  verifyDevIdMid,
  verifyDevAlreadyExistsMiddleware,
  updateDeveloper
);
app.delete('/developers/:id', verifyDevIdMid, deleteDeveloper);

app.post(
  '/developers/:id/infos',
  verifyDevIdMid,
  verifyInfoAlreadyExistsMid,
  createDevInfo
);

export default app;
