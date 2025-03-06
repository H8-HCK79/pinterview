import UserModel from "@/db/models/users";
import { IUser } from "@/interfaces/IUser";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id") as string;

    const user: IUser = await UserModel.findById(userId);
    await UserModel.where("_id", userId).update({
      quota: user.quota + 10,
    });

    return Response.json({ message: "Add quota Successful" }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}