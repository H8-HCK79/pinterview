"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/ui/JobsCard";
import { IJobClient } from "@/interfaces/IJob";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Jobs() {
  const [status, setStatus] = useState("Ready to apply");
  const [jobs, setJobs] = useState<IJobClient[]>([]);

  const fetchJobs = async (selectedStatus: string) => {
    const access_token = Cookies.get("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/jobs?status=${selectedStatus}`,
        {
          method: "GET",
          headers: {
            Cookie: `access_token=${access_token.value}`,
          },
        }
      );

      const result = (await response.json()).data;
      console.log(result, "<-- dapet result");
      

      setJobs(result);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs(status);
  }, [status]);

  return (
    <div className="container min-h-[90%] mx-auto py-2 px-4 bg-gradient-to-br from-[#0077b6] to-[#023e8a]  rounded-r-3xl shadow-2xl">
      <div className="absolute top-10 w-32 h-32 bg-white/10 rounded-full "></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-300/10 rounded-full "></div>

      <div className="flex justify-between  ">
        <h1 className="text-3xl text-white font-bold mb-8">Job Applications</h1>
        {/* perbuttonan */}
        <div className="flex gap-1">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="  border rounded"
          >
            <option value="Ready to apply">Filter by Status</option>
            <option value="Pending">Pending</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Accepted">Accepted</option>
            <option value="Ghosted">Ghosted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <Link href={"/add-jobs"}>
            <Button variant="outline">Add Jobs</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs?.map((job) => (
          <Link key={job._id} href={`/jobs/${job._id}`}>
            <JobCard key={job._id} job={job} />
          </Link>
        ))}
      </div>
    </div>
  );
}
