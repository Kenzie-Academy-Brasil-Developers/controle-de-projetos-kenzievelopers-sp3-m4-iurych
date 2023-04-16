import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import format from 'pg-format';
import {
  TDeveloperInfo,
  TDeveloperInfoRequest,
} from '../interface/developer.interfaces';
import { client } from '../database';

export const createDevInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const devId = res.locals.developer.id;
  const devInfoData: TDeveloperInfoRequest = req.body;
  devInfoData.developerId = devId;

  const arrayDevInfoData = ['Linux', 'Windows', 'MacOS'];

  const verifyReferredOS = arrayDevInfoData.includes(devInfoData.preferredOS);

  if (!verifyReferredOS) {
    return res.status(400).json({
      message: 'Invalid OS option.',
      options: ['Windows', 'Linux', 'MacOS'],
    });
  }

  const queryString: string = format(
    `
    INSERT INTO developer_infos
        (%I)
    VALUES 
        (%L)
    RETURNING *;
    
    `,
    Object.keys(devInfoData),
    Object.values(devInfoData)
  );
  console.log('antes');
  console.log(Object.keys(devInfoData));
  const queryResult: QueryResult<TDeveloperInfo> = await client.query(
    queryString
  );
  console.log('depois');
  return res.status(201).json(queryResult.rows[0]);
};
