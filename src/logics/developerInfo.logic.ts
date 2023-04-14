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

  const verifyRefer = arrayDevInfoData.includes(devInfoData.referredOS);

  if (!verifyRefer) {
   
    return res.status(400).json({
      message: 'Invalid OS option.',
      options: ['Windows', 'Linux', 'MacOS'],
    });
  }

  // if (devInfoData.referredOS !== 'Linux' || 'Windows' || 'MacOS') {

  //   return res.status(400).json({
  //     message: 'Invalid OS option.',
  //     options: ['Windows', 'Linux', 'MacOS'],
  //   });
  // }

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
  const queryResult: QueryResult<TDeveloperInfo> = await client.query(
    queryString
  );

  return res.status(201).json(queryResult.rows[0]);
};
