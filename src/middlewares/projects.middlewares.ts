import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
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
        WHERE id = $1
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
