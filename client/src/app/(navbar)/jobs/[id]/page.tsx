"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RadarChart from "@/components/radar-chart";
import { useParams, useRouter } from "next/navigation";
import type { IAggregatedJob, IProject } from "@/interfaces/IJob";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  ClipboardList,
  GraduationCap,
  ListTodoIcon,
  Trash,
} from "lucide-react";
import DebugButton from "@/components/DebugButton";

const statusOptions = [
  {
    value: "Ready to apply",
    label: "Ready to Apply",
    color: "bg-green-100 text-green-700",
  },
  { value: "Applied", label: "Applied", color: "bg-gray-100 text-gray-700" },
  {
    value: "Pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "Interview",
    label: "Interview",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "Accepted",
    label: "Accepted",
    color: "bg-green-100 text-green-700",
  },
  { value: "Ghosted", label: "Ghosted", color: "bg-gray-200 text-gray-600" },
  { value: "Rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
];

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { id } = params;
  const [job, setJob] = useState<IAggregatedJob | null>(null);
  const [error, setError] = useState<string>("");
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("Ready to apply");

  const handleChangeStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus); // Update state first

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const handleChangeProjects = async (projectIndex: number) => {
    try {
      // Toggle the completion status of the project at the given index
      const updatedProjects = projects.map((project, index) =>
        index === projectIndex
          ? { ...project, isCompleted: !project.isCompleted }
          : project
      );

      setProjects(updatedProjects); // Update UI state

      // Send the updated projects array to the backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}/projects`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects: updatedProjects }),
        }
      );
      if (!res.ok) {
        throw res;
      }
      console.log(updatedProjects, "<<< ok updatedProjects");
    } catch (error) {
      console.log(error, "<<< err handleChangeProjects");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error((await res.json()).error);
      }
      router.push("/jobs");
    } catch (error: unknown) {
      console.log(error, "<<< err handleDelete");
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const selectedOption = statusOptions.find(
    (option) => option.value === selectedStatus
  );

  async function fetchJob() {
    if (!id) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}/readiness`);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}`);
      const data: IAggregatedJob = (await res.json()).data;
      setJob(data);

      // Update selectedStatus with job.status from backend
      setSelectedStatus(data.status);
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  }

  useEffect(() => {
    fetchJob();
  }, [id]);

  // handleGenerateReadiness;
  const handleGenerateReadiness = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}/readiness`, {
          method: "POST"
        }
      );
      if (!res.ok) throw new Error("Failed to fetch");

      fetchJob();
    } catch (error) {
      console.error("Error populating answers:", error);
    }
  };
  
  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-200 mb-3"></div>
          <div className="h-4 w-32 bg-blue-200 rounded mb-6"></div>
          <div className="text-blue-500 text-lg">Loading job details...</div>
        </div>
      </div>
    );
  }

  const chartedTests: Record<string, number> = {};
  job.tests?.forEach((test) => {
    chartedTests[test.category] = test.score / 10;
  });

  return (
    <div className="flex w-full bg-gray-50">
      {/* Left Panel (Fixed) */}
      <div className="lg:w-1/2 h-[calc(100vh-64px)] overflow-y-auto bg-gradient-to-br from-[#0077b6] to-[#023e8a] p-8 lg:p-12 relative sticky top-[64px]">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-300/10 rounded-full blur-2xl"></div>

        {error ? (
          <div role="alert" className="alert alert-error my-4 h-10 flex">
            <span>{error}</span>
          </div>
        ) : (
          ""
        )}
        <div className="flex justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center text-white mb-6 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 rounded-md hover:text-gray-500 transition-all"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>

        <div className="w-full max-w-xl mx-auto p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <select
                className={`w-full border-gray-300 rounded-lg p-2 ${selectedOption?.color}`}
                value={selectedStatus}
                onChange={handleChangeStatus}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{job.position}</h1>
              <div className="flex items-center mt-2 text-white/80">
                <h2 className="font-medium text-xl">{job.company}</h2>
              </div>
            </div>

            {/* Job Requirements */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold flex items-center">
                <ClipboardList className="h-5 w-5 mr-2" />
                Job Requirements
              </h3>
              <ul className="mt-4 space-y-3">
                {job.requirements.map((el, i) => (
                  <li key={i} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs">{i + 1}</span>
                    </div>
                    <span className="text-white/90">{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* To-Do List */}
            <div className="mt-8 bg-white/10 p-5 rounded-xl">
              <h3 className="text-xl font-semibold flex items-center mb-4">
                <ListTodoIcon className="h-5 w-5 mr-2" />
                Preparation Projects
              </h3>
              <ul className="space-y-3">
                {projects.map((project, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-blue-500"
                      checked={project.isCompleted ?? false} // Assuming completed is a new boolean field
                      onChange={() => handleChangeProjects(index)}
                    />
                    <span
                      className={`text-white/90 ${
                        project.isCompleted ? "line-through opacity-70" : ""
                      }`}
                    >
                      {project.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/2 h-[calc(100vh-64px)] overflow-y-auto p-8 lg:p-12">
        <div className="max-w-xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
              Skills Assessment
            </h2>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Tests to Take
              </h3>
              <Accordion type="single" collapsible className="space-y-3">
                {job.tests?.map((test, i) => (
                  <AccordionItem
                    value={test.category}
                    key={i}
                    className="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                      <Link
                        href={`${
                          test.isGenerated === true
                            ? `/test/${test._id}/review`
                            : `/test/${test._id}/intro`
                        }`}
                        className="flex items-center"
                      >
                        <Badge
                          variant="secondary"
                          className={`px-4 py-2 text-base cursor-pointer ${
                            test.isGenerated === true
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          {test.category}
                        </Badge>
                      </Link>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 text-gray-600 bg-gray-50">
                      {test.summary}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-none">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Job Readiness
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  {job.readiness}%
                </div>
              </div>

              <div className="mb-6">
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"
                    style={{ width: `${job.readiness}%` }}
                  ></div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    View Detailed Breakdown
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Skill Breakdown</DialogTitle>
                    <DialogDescription>
                      Detailed view of your skills for this job.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    {job.tests?.map((test) => (
                      <div key={test._id.toString()} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{test.category}</span>
                          <span className="text-sm font-medium">
                            {Math.round(test.score * 10)}%
                          </span>
                        </div>
                        <Progress
                          value={test.score * 10}
                          className="h-2 w-full"
                        />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <div className="h-64 flex justify-center items-center mt-8 bg-gray-50 rounded-xl p-4">
                <RadarChart data={chartedTests} />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <DebugButton handleGenerateReadiness={handleGenerateReadiness} />
    </div>
  );
}
