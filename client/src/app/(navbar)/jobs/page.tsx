"use client";
import { useState, useEffect } from "react";
import { JobCard } from "@/components/ui/JobsCard";
import { IJobClient } from "@/interfaces/IJob";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  Briefcase,
  XCircle,
  Hourglass,
  Ban,
} from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Statuses", icon: Briefcase }, // Changed value to "all"
  { value: "Ready to apply", label: "Ready to apply", icon: Hourglass },
  { value: "Pending", label: "Pending", icon: Clock },
  { value: "Applied", label: "Applied", icon: CheckCircle },
  { value: "Interview", label: "Interview", icon: CheckCircle },
  { value: "Accepted", label: "Accepted", icon: CheckCircle },
  { value: "Ghosted", label: "Ghosted", icon: Ban },
  { value: "Rejected", label: "Rejected", icon: XCircle },
];


export default function Jobs() {
  const [status, setStatus] = useState("");
  const [jobs, setJobs] = useState<IJobClient[]>([]);

  const fetchJobs = async (selectedStatus: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/jobs?status=${selectedStatus}`,
        { method: "GET" }
      );

      const result = (await response.json()).data;
      setJobs(result);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs(status);
  }, [status]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
      <div className="absolute -top-10 right-40 w-40 h-40 rounded-full bg-blue-200 opacity-20 blur-lg"></div>
      <div className="absolute -bottom-10 left-40 w-56 h-56 rounded-full bg-blue-600 opacity-20 blur-xl"></div>

      {/* Content Container */}
      <div className="relative w-full max-w-6xl bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl text-white font-bold">Job Application Preparation</h1>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <Select
              value={status || "all"}
              onValueChange={(value) => setStatus(value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-[200px] bg-white border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* "Add Job" Card-Style Button */}
          <Link href="/add-jobs">
            <Card className="h-full flex flex-col items-center justify-center shadow-md rounded-lg bg-white/80 border-dashed border-2 border-gray-400 cursor-pointer hover:bg-gray-100 hover:scale-105 transition-transform duration-300">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Plus className="h-10 w-10 text-gray-500" />
                <span className="mt-2 text-gray-700 font-medium">
                  Add a Job
                </span>
              </CardContent>
            </Card>
          </Link>

          {/* Job Cards */}
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                className="hover:scale-105 transition-transform"
              >
                <JobCard job={job} />
              </Link>
            ))
          ) : (
            <p className="text-center text-white text-lg col-span-full">
              No jobs found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
