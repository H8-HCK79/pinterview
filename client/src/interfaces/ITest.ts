export interface ITest {
  _id: string;
  jobId: string;
  category: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}


export interface ITestInput {
  category: string;
  position:string
}