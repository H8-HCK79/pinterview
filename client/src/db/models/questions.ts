import { IInterviewQuestion, IQuestion } from "@/interfaces/IQuestion";
import { ObjectId } from "mongodb";
import { Mongoloquent } from "mongoloquent";




export default class QuestionModel extends Mongoloquent {
    static collection ='questions'


    static async getAllQuestions() {
       try {
        const questions = await QuestionModel.get()
        
        return questions
       } catch (error) {
        throw error
       }
    }

    static async generateQuestion(payload:IInterviewQuestion,testId:string) {//create
        try {
            const {type,question,expectedAnswer} = payload
            const newQuestion = { 
              testId: new ObjectId(testId),
              type,
              question,
              answer:'',
              expectedAnswer,
              feedback:'',
              createdAt:new Date(),
              updatedAt: new Date()
            } 
            const response = await QuestionModel.insert(newQuestion)

            return response
        } catch (error) {
            throw error
        }
    }
}