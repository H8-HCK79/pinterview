import TestModel from "@/db/models/tests";
import { ITest } from "@/interfaces/ITest";

export type Params = {
  params: Promise<{ testId: string }>;
};
export async function GET(req: Request, { params }: Params) {
  try {
    const { testId } = await params;
    const test: ITest = await TestModel.findById(testId);

    return Response.json({ data: test }, { status: 200 });
  } catch (err) {
    console.log(err, "[testId]")
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
