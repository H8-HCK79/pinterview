
import { type NextRequest } from "next/server";
import JobModel from "@/db/models/jobs";
import { ZodError } from "zod";
import { IJobResponseAI } from "@/interfaces/IJob";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    if (status) {
      const filterJobs = await JobModel.filterByStatus(status);
      return Response.json({ filterJobs }, { status: 200 });
    }

    const jobs = await JobModel.getAllJob();
    return Response.json({ jobs }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const issues = error.issues;
      const issue = issues[0];

      return Response.json({ message: issue.message }, { status: 404 });
    } else {
      return Response.json(
        { message: "internal server error" },
        { status: 500 }
      );
    }
  }
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const newJob = await JobModel.generateJob(body);

//     return Response.json({ newJob }, { status: 201 });
//   } catch (error: unknown) {
//     if (error instanceof ZodError) {
//       const issues = error.issues;
//       const issue = issues[0];

//       return Response.json({ message: issue.message }, { status: 400 });
//     } else {
//       return Response.json(
//         { message: "internal server error" },
//         { status: 500 }
//       );
//     }
//   }
// }

// import { generateJobAI } from "@/services/openai/generate-job";

const responseOpenAI:IJobResponseAI = {
  response: {
    job: {
      company: "TechNova Solutions",
      position: "Full Stack Developer (Node.js/React)",
      description:
        "TechNova Solutions is a forward-thinking software company that specializes in AI-driven automation tools for enterprises. We strive to build efficient, scalable, and intelligent solutions that transform business processes.",
      skills: [
        "Node.js",
        "React",
        "MongoDB",
        "GraphQL",
        "TypeScript",
        "AWS",
        "Docker",
        "CI/CD",
      ],
      requirements: [
        "Bachelor’s degree in Computer Science or related field",
        "3+ years of experience as a Full Stack Developer",
        "Strong proficiency in Node.js and React",
        "Experience with NoSQL databases like MongoDB",
        "Knowledge of GraphQL and RESTful API development",
        "Familiarity with cloud services such as AWS and containerization using Docker",
        "Ability to work independently and in a team",
      ],
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id") as string;
    // const { company, position, rawDescription } = await req.json();
    // const responseOpenAI = await generateJobAI(
    //   company,
    //   position,
    //   rawDescription
    // );

    if (!responseOpenAI) {
      return Response.json(
        { error: "Failed to generate test questions" },
        { status: 500 }
      );
    }
    const job = await JobModel.generateJob(responseOpenAI,userId) 
    // panggil model generateJob, olah responseOpenAI menjadi job dengan in format interface IJob

    return Response.json({ data: job }, { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}