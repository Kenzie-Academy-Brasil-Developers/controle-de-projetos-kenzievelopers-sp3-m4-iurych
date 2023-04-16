import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { client } from '../database';
import { TDeveloper } from '../interface/developer.interfaces';

export const verifyDevIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number;
  id = Number(req.params.id);

  if (req.route.path === '/projects' && req.method === 'POST') {
    id = Number(req.body.developerId);
  } else if (req.route.path === '/projects/:id' && req.method === 'PATCH') {
    id = Number(req.body.developerId);
  }

  const queryString: string = `
        SELECT * FROM developers
        WHERE "id" = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: 'Developer not found.',
    });
  }
  res.locals.developer = queryResult.rows[0];

  return next();
};

export const verifyDevAlreadyExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const devEmail: string = req.body.email;

  const queryString: string = `
        SELECT * FROM developers
        WHERE "email" = $1        
    
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [devEmail],
  };

  const queryResult: QueryResult<TDeveloper> = await client.query(queryConfig);

  if (queryResult.rows[0]) {
    return res.status(409).json({
      message: 'Email already exists.',
    });
  }

  return next();
};
