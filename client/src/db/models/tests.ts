import { ITest, ITestInput } from "@/interfaces/ITest";
import { ObjectId } from "mongodb";
import { Mongoloquent } from "mongoloquent";


export default class TestModel extends Mongoloquent {
  static collection = "tests";

  static async generate(payload: ITestInput, jobId: ObjectId) {
    try {
      const { category, position } = payload;
      const newTest = {
        jobId: new ObjectId(jobId),
        category,
        position,
        summary: "",
        score: 0,
        isGenerated: false,
        isReviewed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const response = await TestModel.insert(newTest);

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: string) {
    try {
      const test = await TestModel.find(id);

      return test.data as ITest;
    } catch (error) {
      throw error;
    }
  }

  static async findAllByJobId(jobId: string) {
    try {
      const tests = await TestModel.where("jobId", new ObjectId(jobId)).get();

      return tests as ITest[];
    } catch (error) {
      throw error;
    }
  }
}
