import { NextFunction, Request, Response } from 'express';

export const verifyInfoAlreadyExistsMid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
    const devId: number = res.locals.developer.id

    const queryString: string = `
        
    `

};
