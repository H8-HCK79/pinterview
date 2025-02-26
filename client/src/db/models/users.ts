import { IUser, LoginInput, RegisterInput } from "@/interfaces/IUser";
import { Mongoloquent } from "mongoloquent";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";

import { comparePassword, hashPassword } from "@/helpers/bcrypt";
import { signToken } from "@/helpers/jwt";
import { ObjectId } from "mongodb";
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});
export const UserSchema = z.object({
  fullName: z.string().nonempty({message:'Full name is required'}),
  email: z.string().nonempty({message:' Email is required'}),
  password: z.string().min(5).nonempty({message:'Password is required more than 5 characters'}),
  birthDate: z.string().nonempty({message:'Birth date is required'}),
});
export default class UserModel extends Mongoloquent {
  static collection = "users";
  static softDelete = true;

  static async Register(payload: RegisterInput) {
    UserSchema.parse(payload);

    try {
      const { fullName, email, password, birthDate } = payload;

      const hashedPassword = hashPassword(password);

      const newUser = await UserModel.insert({
        fullName,
        email,
        password: hashedPassword,
        birthDate,
        quota: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  static async Login(payload: LoginInput) {
    loginSchema.parse(payload);

    try {
      const { email, password } = payload;
      const { data } = (await UserModel.where("email", email).first()) as {
        data: IUser;
      };

      if (!data) throw new Error(`Invalid email/password`);

      const compared = comparePassword(password, data.password);

      if (!compared) throw new Error(`Invalid email/password`);

      const access_token = signToken({ _id: data._id });

      return access_token;
    } catch (error) {
      throw error;
    }
  }
  static async GoogleLogin(googlToken: string) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
    const client = new OAuth2Client(googleClientId);

    const ticket = await client.verifyIdToken({
      idToken: googlToken,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");

    const { sub, name, email, picture } = payload;

    let user = (await UserModel.where("email", email).first()) as {
      data: IUser;
    };

    if (!user) {
      // Jika user belum ada, buat user baru dengan akun Google
      const newUser = await UserModel.insert({
        fullName: name,
        email,
        password: "googlelogin", // Kosong karena login dengan Google
        birthDate: "", // Bisa disesuaikan jika Google menyediakan
        quota: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const accessToken = signToken({ _id: user.data._id });

    return { user: user.data, accessToken };
  }

  static async UserById(id:string) {
    const user = await UserModel.find(id)

    return user.data
}
}