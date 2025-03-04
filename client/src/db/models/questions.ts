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

      return question.data as IQuestion;
    } catch (error) {
      throw error;
    }
  }

  static async findAllByTestId(testId: string) {
    try {
      const questions = await QuestionModel.where(
        "testId",
        new ObjectId(testId)
      ).get();
      return questions as IQuestion[];
    } catch (error) {
      throw error;
    }
  }

  static async findConceptsByTestId(testId: string) {
    try {
      let conceptQuestions: unknown = await QuestionModel.where(
        "testId",
        new ObjectId(testId)
      ).paginate(1, 5);
      console.log(conceptQuestions, "<<< ok");

      return conceptQuestions as {
        data: IQuestion[];
        meta: {
          total: number;
          page: number;
          perPage: number;
          lastPage: number;
        };
      };
    } catch (error) {
      throw error;
    }
  }

  static async findTechnicalsByTestId(testId: string) {
    try {
      let technicalQuestions: unknown = await QuestionModel.where(
        "testId",
        new ObjectId(testId)
      ).paginate(2, 5);
      console.log(technicalQuestions, "<<< ok");

      return technicalQuestions as {
        data: IQuestion[];
        meta: {
          total: number;
          page: number;
          perPage: number;
          lastPage: number;
        };
      };
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
