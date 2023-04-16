import { NextFunction, Request, Response } from 'express';
import { Query, QueryConfig, QueryResult } from 'pg';
import { TProject } from '../interface/projects.inteface';
import { client } from '../database';

export const verifyProjectIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId: number = Number(req.params.id);

  const queryString: string = `
        SELECT * FROM projects
        WHERE "id" = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId],
  };

  const queryResult: QueryResult<TProject> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: 'Project not found.',
    });
  }

  res.locals.project = queryResult.rows[0];

  return next();
};

export const verifyValidTechNameMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let techName: string = req.body.name;

  if (
    req.route.path === '/projects/:id/technologies/:name' &&
    req.method === 'DELETE'
  ) {
    techName = req.params.name;
  }

  const queryString: string = `
    SELECT * FROM technologies
    WHERE name = $1
  `;
  const queryResult: QueryResult = await client.query(queryString, [techName]);

  if (queryResult.rowCount === 0) {
    return res.status(400).json({
      message: 'Technology not supported.',
      options: [
        'JavaScript',
        'Python',
        'React',
        'Express.js',
        'HTML',
        'CSS',
        'Django',
        'PostgreSQL',
        'MongoDB',
      ],
    });
  }

  res.locals.technologies = queryResult.rows[0];

  return next();
};

export const verifyProjectTechExisteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projctId = res.locals.project.id;
  const techId = res.locals.technologies.id;

  const queryString: string = `
    SELECT * FROM projects_technologies
    WHERE  
      "projectId" = $1 
    AND
      "technologyId" = $2;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projctId, techId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rows[0] === 0) {
    return res.status(400).json({
      message: 'Technology not related to the project.',
    });
  }

  return next();
};
