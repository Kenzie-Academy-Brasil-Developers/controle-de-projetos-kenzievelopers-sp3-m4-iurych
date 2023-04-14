import { Request, Response } from 'express';
import {
  TDeveloper,
  TDeveloperJoinInfoRetrive,
  TDeveloperRequest,
} from '../interface/developer.interfaces';
import format from 'pg-format';
import { QueryConfig, QueryResult } from 'pg';
import { client } from '../database';

export const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const devData: TDeveloperRequest = req.body;

  if (Object.keys(devData).length !== 2) {
    return res.json({
      message: 'name and email must be created together',
    });
  } else if (!devData.email && !devData.name) {
    return res.json({
      message: 'only email and name are permitted to change',
    });
  }

  const queryString: string = format(
    `

          INSERT INTO developers
              (%I)
          VALUES
              (%L)
          RETURNING *;

      `,
    Object.keys(devData),
    Object.values(devData)
  );

  const queryResult: QueryResult<TDeveloper> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

export const retrieveDevById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const devId: number = res.locals.developer.id;

  const queryString: string = `
    SELECT 
        dev."id" "developerId",
        dev."name" "developerName",
        dev."email" "developerEmail",
        di."developerSince" "developerInfoDeveloperSince",
        di."preferredOS" "developerInfoPreferredOS"
    FROM
        developers dev
    LEFT JOIN 
        developer_infos di ON dev."id" = di."developerId"
    WHERE dev."id" = $1;
    
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [devId],
  };
  const queryResult: QueryResult<TDeveloperJoinInfoRetrive> =
    await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

export const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const devId: number = res.locals.developer.id;
  const devDataToUpdate: Partial<TDeveloperRequest> = req.body;

  if (Reflect.has(devDataToUpdate, 'id')) {
    return res.status(400).json({
      message: 'id is not possible to change',
    });
  }

  const queryString: string = format(
    `
    UPDATE developers
    SET(%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
  `,
    Object.keys(devDataToUpdate),
    Object.values(devDataToUpdate)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [devId],
  };

  const queryResult: QueryResult<TDeveloper> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

export const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const devId: number = res.locals.developer.id;

  const queryString: string = `
        DELETE FROM developers
        WHERE "id" = $1
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [devId],
  };
  await client.query(queryConfig);

  return res.status(204).send();
};
