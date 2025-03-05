import UserModel from "@/db/models/users";
import { IUser } from "@/interfaces/IUser";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id") as string;
    console.log(userId, "<<< userId")
    const user: IUser = await UserModel.findById(userId);

    await UserModel.where("_id", userId).update({
      quota: user.quota + 3,
    });

    // Update collection transaction di database

    return Response.json({ message: "Quota added successful" }, { status: 200 });
  } catch (err) {
    console.log(err, "<<< quota")
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
