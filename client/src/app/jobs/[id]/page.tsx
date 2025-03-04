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
import { StatusBadge } from "@/components/ui/JobsCard";
import { useParams } from "next/navigation";
import { IAggregatedJob } from "@/interfaces/IJob";
import Link from "next/link";

export default function JobDetailsPage() {
  // State Hooks - Always in the same order
  const params = useParams<{ id: string }>();
  const { id } = params;

  const [job, setJob] = useState<IAggregatedJob | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>("React");

  // Fetch job data on component mount
  useEffect(() => {
    async function fetchJob() {
      if (!id) return; // Prevent fetch if id is undefined
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

  // Show loading state if job is not yet loaded
  if (!job) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Convert job tests into a format suitable for RadarChart
  const chartedTests: Record<string, number> = {};
  job.tests?.forEach((test) => {
    chartedTests[test.category] = test.score / 10;
  });
  console.log(chartedTests, "chartedTests");

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Job Title and Company */}
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-bold">{job.position}</h1>
              <h2 className="text-xl font-semibold text-[#0077b6]">
                {job.company}
              </h2>
            </div>
            <StatusBadge status={job.status} />
          </div>

          {/* Requirement List */}
          <div>
            <h1 className="text-xl font-bold">Requirement</h1>
            <ul>
              {job?.requirements?.map((requirement: string, i: number) => (
                <li key={i}>{requirement}</li>
              ))}
            </ul>
          </div>

          {/* Tests to Take */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tests to take:</h3>
            <Accordion type="single" collapsible className="w-full">
              {job?.tests?.map((test, i) => (
                <AccordionItem value={test.category} key={i}>
                  <AccordionTrigger>
                    <Link href={`/test/${test._id}/intro`}>
                      <Badge
                        variant={
                          selectedSkill === test.category
                            ? "default"
                            : "secondary"
                        }
                        className="px-4 py-2 text-base cursor-pointer"
                        onClick={() => setSelectedSkill(test.category)}
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
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Readiness Chart */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Readiness: {job.readiness}%
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Details</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Skill Breakdown</DialogTitle>
                    <DialogDescription>
                      Detailed view of your skills for this job.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    {job?.tests?.map((test) => (
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
            </div>
            <div className="h-64">
              <RadarChart data={chartedTests} skillName={selectedSkill} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
