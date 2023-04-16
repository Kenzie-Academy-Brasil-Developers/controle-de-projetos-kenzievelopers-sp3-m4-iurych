import { Request, Response } from 'express';
import {
  TProjectRequest,
  TProjectRetrieve,
} from '../interface/projects.inteface';
import format from 'pg-format';
import { QueryConfig, QueryResult } from 'pg';
import { TProject } from '../interface/projects.inteface';
import { client } from '../database';

export const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: TProjectRequest = req.body;

  const queryString: string = format(
    `
        INSERT INTO projects
            (%I)
        VALUES 
            (%L)
        RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );
  const queryResult: QueryResult<TProject> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

export const retrieveProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = res.locals.project.id;

  const queryString: string = `
  SELECT 
    proj."id" "projectId",
    proj."name" "projectName",
    proj."description" "projectDescription",
    proj."estimatedTime" "projectEstimatedTime",
    proj."repository" "projectRepository",
    proj."startDate" "projectStartDate",
    proj."endDate" "projectEndDate",
    proj."developerId" "projectDeveloperId",
    tech."id" "technologyId",
    tech."name" "technologyName"
  FROM projects proj
  LEFT JOIN projects_technologies pt 
  ON pt."projectId" = proj."id"
  LEFT JOIN technologies tech
  ON tech."id" = pt."technologyId"
  WHERE proj."id" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId],
  };

  const queryResult: QueryResult<TProjectRetrieve> = await client.query(
    queryConfig
  );
  return res.json(queryResult.rows);
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = res.locals.project.id;
  const projectData: Partial<TProjectRequest> = req.body;

  const queryString: string = format(
    `
    UPDATE projects
    SET(%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
  `,
    Object.keys(projectData),
    Object.values(projectData)
  );
  const queryResult: QueryResult<TProject> = await client.query(queryString, [
    projectId,
  ]);

  return res.json(queryResult.rows[0]);
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = res.locals.project.id;

  const queryString: string = `
    DELETE FROM projects
    WHERE id = $1

  `;
  await client.query(queryString, [projectId]);

  return res.status(204).send();
};
