import { Request, Response } from 'express';
import {
  TProjectRequest,
  TProjectRetrieve,
  TProjectTechRequest,
  TProjectTechsRetrieve,
  TTechnologies,
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
  const projectId: number = res.locals.project.id;

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
  const projectId: number = res.locals.project.id;
  const projectData: Partial<TProjectRequest> = req.body;

  const queryString: string = format(
    `
    UPDATE projects
    SET(%I) = ROW(%L)
    WHERE "id" = $1
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
  const projectId: number = res.locals.project.id;

  const queryString: string = `
    DELETE FROM projects
    WHERE "id" = $1

  `;
  await client.query(queryString, [projectId]);

  return res.status(204).send();
};

export const addTechToProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projctId = res.locals.project.id;
  const projectTechData: TTechnologies = res.locals.technologies;

  const date: Date = new Date();

  const newProjectTechDate: TProjectTechRequest = {
    addedIn: date,
    projectId: projctId,
    technologyId: projectTechData.id,
  };

  const queryStringVerifyTechName: string = `
    SELECT * FROM projects_technologies
    WHERE
      "projectId" = $1
    AND
      "technologyId" = $2
  `;
  const queryConfig: QueryConfig = {
    text: queryStringVerifyTechName,
    values: [newProjectTechDate.projectId, newProjectTechDate.technologyId],
  };
  const queryResultVerifyTechName: QueryResult<TProjectTechsRetrieve> =
    await client.query(queryConfig);

  if (queryResultVerifyTechName.rows[0]) {
    return res.status(409).json({
      message: 'This technology is already associated with the project',
    });
  }

  const queryString: string = format(
    `
    INSERT INTO projects_technologies
      (%I)
    VALUES
      (%L)

  `,
    Object.keys(newProjectTechDate),
    Object.values(newProjectTechDate)
  );

  const queryResult: QueryResult = await client.query(queryString);

  const queryStringList: string = format(`
    SELECT 
      tech."id" "technologyId",
      tech."name" "technologyName",
      proj."id" "projectId",
      proj."name" "projectName",
      proj."description" "projectDescription",
      proj."estimatedTime" "projectEstimatedTime",
      proj."repository" "projectRepository",
      proj."startDate" "projectStartDate",
      proj."endDate" "projectEndDate"
  FROM
      projects proj
  LEFT JOIN 
      projects_technologies pt ON pt."projectId" = proj."id"
  LEFT JOIN 
      technologies tech ON tech."id" = pt."technologyId"
  WHERE
    proj."id" = $1;
  
  `);

  const queryResultToShow: QueryResult = await client.query(queryStringList, [
    projctId,
  ]);

  return res.status(201).json(queryResultToShow.rows[0]);
};

export const deleteTechProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = res.locals.project.id;
  const techId = res.locals.technologies.id;

  const queryStringCheck: string = `
    SELECT * FROM projects_technologies
    WHERE  
      "projectId" = $1 
    AND
      "technologyId" = $2;
  `;
  const queryConfigCheck: QueryConfig = {
    text: queryStringCheck,
    values: [projectId, techId],
  };

  const queryResult: QueryResult = await client.query(queryConfigCheck);

  if (queryResult.rows[0] === 0) {
    return res.status(400).json({
      message: 'Technology not related to the project.',
    });
  }

  const queryString: string = `
    DELETE FROM projects_technologies
    WHERE  
      "projectId" = $1 
    AND
      "technologyId" = $2;
  
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId, techId],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};
