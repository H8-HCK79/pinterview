export interface IJob {
  _id: string;
  userId: string;
  company: string;
  position: string;
  description: string;
  requirement: string;
  qualification: string;
  status: string;
  readiness: number;
  createdAt: string;
  updatedAt: string;
}
