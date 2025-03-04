import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/ui/JobsCard";
import { IJob, IJobClient } from "@/interfaces/IJob";
import { Filter } from "lucide-react";
import Link from "next/link";
import { cookies } from 'next/headers'


export default async function Jobs() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token')

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
    <div className="container mx-auto py-2 px-4 min-h-screen ">
      <div className="flex justify-between  ">
        <h1 className="text-xl font-md mb-8">Job Applications</h1>
        {/* perbuttonan */}
        <div className="flex gap-1">
          <Button>
            <Filter />
            Filter
          </Button>
          <Link href={"/add-jobs"}>
            <Button variant="outline">Add Jobs</Button>
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
