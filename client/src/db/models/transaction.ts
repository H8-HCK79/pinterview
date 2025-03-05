import { ObjectId } from "mongodb";
import { Mongoloquent } from "mongoloquent";


export default class TransactionModel extends Mongoloquent {
  static collection = "transactions";

  static async fetchAllByUserId(userId: string) {
      try {
        const transactions = await TransactionModel.where(
          "userId",
          new ObjectId(userId)
        ).get();
  
        return transactions;
      } catch (error) {
        throw error;
      }
    }

}
