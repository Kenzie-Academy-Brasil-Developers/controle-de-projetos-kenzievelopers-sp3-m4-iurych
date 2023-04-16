export type TProject = {
  id: number;
  name: string;
  description: string;
  estimatedTime?: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
};

export type TProjectTech = {
  id: number;
  addedIn: Date;
  projectId: number;
  technologyId: number;
};

export type TProjectRequest = Omit<TProject, 'id'>;
export type TProjectTechRequest = Omit<TProjectTech, 'id'>;

export type TProjectRetrieve = {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime?: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date | null;
  projectDeveloperId: number;
  technologyId: number | null;
  technologyName: number | null;
};

export type TProjectTechsRetrieve = {
  technologyId: number | null;
  technologyName: number | null;
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime?: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date | null;
  projectDeveloperId: number;
};

export type TTechnologies = {
  id: number;
  name: string;
};
