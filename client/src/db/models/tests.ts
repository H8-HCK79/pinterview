import { ITestInput } from "@/interfaces/ITest";
import { ObjectId } from "mongodb";
import { Mongoloquent } from "mongoloquent";


export default class TestModel extends Mongoloquent {
  static collection = "tests";

  static async getAllTests() {
    try {
        const tests = await TestModel.get()
        return tests
    } catch (error) {
        throw error
    }
  }

  static async generateTest(payload: ITestInput,jobId:string) {
    try {
      const {  category } = payload;
        const newTest = {
            jobId:new ObjectId(jobId),
            category,
            summary:"",
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const response = await TestModel.insert(newTest)
        console.log(response,"AKU APAAN YA");
        
        return response
    } catch (error) {
      throw error;
    }
  }


  static async fetchById(id:string) {
    try {
        const test = await TestModel.find(id)

        return test
    } catch (error) {
        throw error
    }
  }
}
