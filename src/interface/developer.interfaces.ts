export type TDeveloper = {
  id: number;
  name: string;
  email: string;
};

export type TDeveloperRequest = Omit<TDeveloper, 'id'>;

export type TDeveloperJoinInfoRetrive = {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
};

export type TDeveloperInfo = {
  id: number;
  developerSince: Date;
  referredOS: 'Linux' | 'Windows' | 'MacOs';
  developerId: number;
};

export type TDeveloperInfoRequest = Omit<TDeveloperInfo, 'id'>;
