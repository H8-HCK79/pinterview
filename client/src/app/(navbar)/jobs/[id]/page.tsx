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
import { useParams } from "next/navigation";
import { IAggregatedJob } from "@/interfaces/IJob";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/JobsCard";

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [job, setJob] = useState<IAggregatedJob | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>("React");
  const [toDoList, setToDoList] = useState<string[]>([
    "Update Resume",
    "Practice Interview",
    "Learn Advanced JavaScript",
  ]);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}`
        );
        const data = await res.json();
        setJob(data.data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    }
    fetchJob();
  }, [id]);

  if (!job) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const chartedTests: Record<string, number> = {};
  job.tests?.forEach((test) => {
    chartedTests[test.category] = test.score / 10;
  });

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div className="bg-gradient-to-br from-[#0077b6] to-[#023e8a] flex flex-1 flex-col justify-center items-center px-10 relative rounded-r-3xl shadow-2xl">
        <div className="w-full max-w-lg p-8 bg-white backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold text-center ">Job Details</h2>
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-blue-800">{job.position}</h1>
            <h2 className="font-semibold text-gray-700">{job.company}</h2>
            <StatusBadge status={job.status} />

            {/* Job Requirements */}
            <div className="mt-4">
              <h3 className="font-semibold text-lg">Job Requirements</h3>
              <ul className="list-disc list-inside text-gray-800 mt-2">
                {job.requirements.map((el, i) => (
                  <li key={i} className="text-sm">
                    {el}
                  </li>
                ))}
              </ul>
            </div>

            {/* To-Do List */}
            <div className="mt-4">
              <h3 className="font-semibold text-lg">To-Do List</h3>
              <ul className="mt-2 space-y-2">
                {toDoList.map((task, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-10 shadow-2xl">
        <div className="container mx-auto overflow-y-scroll ">
          <div className="overflow-y-auto max-h-56">
            <h3 className="text-lg font-bold mb-4">Tests to Take</h3>
            <Accordion type="single" collapsible>
              {job.tests?.map((test, i) => (
                <AccordionItem value={test.category} key={i}>
                  <AccordionTrigger>
                    <Link href={`/test/${test._id}/intro`}>
                      <Badge
                        variant="secondary"
                        className="px-4 py-2 text-base cursor-pointer"
                      >
                        {test.category}
                      </Badge>
                    </Link>
                  </AccordionTrigger>
                  <AccordionContent>{test.summary}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Card className="mt-8 p-4">
            <h3 className="text-lg font-medium">Readiness: {job.readiness}%</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Details</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Skill Breakdown</DialogTitle>
                  <DialogDescription>
                    Detailed view of your skills for this job.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {job.tests?.map((test) => (
                    <div
                      key={test._id.toString()}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>{test.category}</span>
                      <Progress value={test.score * 100} className="w-1/2" />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <div className="h-fit flex justify-center mt-4">
              <RadarChart data={chartedTests} skillName={selectedSkill} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
