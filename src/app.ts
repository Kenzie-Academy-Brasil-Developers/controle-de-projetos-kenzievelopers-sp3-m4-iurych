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
  verifyDevIdMiddleware,
} from './middlewares/developers.middlewares';
import { createDevInfo } from './logics/developerInfo.logic';
import { verifyInfoAlreadyExistsMid } from './middlewares/developerInfo.middlewares';
import {
  addTechToProject,
  createProject,
  deleteProject,
  deleteTechProject,
  retrieveProjectById,
  updateProject,
} from './logics/project.logic';
import {
  verifyValidTechNameMiddleware,
  verifyProjectIdMiddleware,
  verifyProjectTechExisteMiddleware,
} from './middlewares/projects.middlewares';

const app: Application = express();
app.use(express.json());

//DEVELOPERS & INFO
app.post('/developers', verifyDevAlreadyExistsMiddleware, createDeveloper);
app.get('/developers/:id', verifyDevIdMiddleware, retrieveDevById);
app.patch(
  '/developers/:id',
  verifyDevIdMiddleware,
  verifyDevAlreadyExistsMiddleware,
  updateDeveloper
);
app.delete('/developers/:id', verifyDevIdMiddleware, deleteDeveloper);

app.post(
  '/developers/:id/infos',
  verifyDevIdMiddleware,
  verifyInfoAlreadyExistsMid,
  createDevInfo
);

//PROJECTS & TECHNOLOGIES
app.post('/projects', verifyDevIdMiddleware, createProject);
app.get('/projects/:id', verifyProjectIdMiddleware, retrieveProjectById);
app.patch(
  '/projects/:id',
  verifyDevIdMiddleware,
  verifyProjectIdMiddleware,
  updateProject
);
app.delete('/projects/:id', verifyProjectIdMiddleware, deleteProject);
app.post(
  '/projects/:id/technologies',
  verifyProjectIdMiddleware,
  verifyValidTechNameMiddleware,
  addTechToProject
);
app.delete(
  '/projects/:id/technologies/:name',
  verifyProjectIdMiddleware,
  verifyValidTechNameMiddleware,
  deleteTechProject
);

export default app;
