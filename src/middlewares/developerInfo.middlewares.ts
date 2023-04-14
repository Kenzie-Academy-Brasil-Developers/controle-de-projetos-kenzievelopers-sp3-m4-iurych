import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { client } from '../database';
import { TDeveloperInfo } from '../interface/developer.interfaces';

export const verifyInfoAlreadyExistsMid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const devId: number = res.locals.developer.id;

  const queryString: string = `
    SELECT * FROM developer_infos 
    WHERE "developerId"  = $1; 
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [devId],
  };

  const queryResult: QueryResult<TDeveloperInfo> = await client.query(
    queryConfig
  );

  if (queryResult.rows[0]) {
    return res.status(409).json({
      message: 'Developer infos already exists.',
    });
  }

  return next();
};
