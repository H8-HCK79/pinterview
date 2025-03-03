import { IInterviewQuestion, IQuestion } from "@/interfaces/IQuestion";
import { ObjectId } from "mongodb";
import { Mongoloquent } from "mongoloquent";

export default class QuestionModel extends Mongoloquent {
  static collection = "questions";

  static async findAll() {
    try {
      const questions = await QuestionModel.get();

      return questions;
    } catch (error) {
      throw error;
    }
  }

  static async findById(testId: string) {
    try {
      const question = await QuestionModel.find(new ObjectId(testId));

      return question.data as IQuestion
    } catch (error) {
      throw error;
    }
  }

  static async findAllByTestId(testId: string) {
    try {
      const tests = await QuestionModel.where(
        "testId",
        new ObjectId(testId)
      ).get();
      return tests as IQuestion[];
    } catch (error) {
      throw error;
    }
  }

  static async generateMany(
    payload: { questions: IInterviewQuestion[] },
    testId: string
  ) {
    //create
    try {
      const newQuestions = payload.questions.map((questionParent) => {
        const { type, question, expectedAnswer } = questionParent;
        return {
          testId: new ObjectId(testId),
          type,
          question,
          expectedAnswer,
          answer: "",
          correctness: 0,
          feedback: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      const response = await QuestionModel.insertMany(newQuestions);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
