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

export type TProjectRequest = Omit<TProject, 'id'>;

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
