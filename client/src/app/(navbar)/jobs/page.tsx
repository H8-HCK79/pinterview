import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/ui/JobsCard";
import { IJobClient } from "@/interfaces/IJob";
import { Filter } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function Jobs() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");

  console.log(access_token, "access_token");

  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs`, {
    method: "GET",
    headers: {
      Cookie: `access_token=${access_token?.value}`,
    },
  });

  console.log(data, "<<< ok jobs");
  const jobs: IJobClient[] = (await data.json()).data;

  return (
    <div className="container mx-auto py-2 px-4 min-h-screen  bg-gradient-to-br from-[#0077b6] to-[#023e8a]  rounded-r-3xl shadow-2xl">
      <div className="absolute top-10 right-64 w-32 h-32 bg-white/10 rounded-full "></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-300/10 rounded-full "></div>

      <div className="flex justify-between  ">
        <h1 className="text-3xl text-white font-bold mb-8">Job Applications</h1>
        {/* perbuttonan */}
        <div className="flex gap-1">
          <Button>
            <Filter />
            Filter
          </Button>
          <Link href={"/add-jobs"}>
            <Button variant="outline" >
              Add Jobs
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Link key={job._id} href={`/jobs/${job._id}`}>
            <JobCard key={job._id} job={job} />
          </Link>
        ))}
      </div>
    </div>
  );
}
