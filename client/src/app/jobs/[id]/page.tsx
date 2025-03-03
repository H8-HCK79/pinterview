"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// import { Checkbox } from "@/components/ui/checkbox";
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
  const params = useParams<{ id: string }>();
  const { id } = params;
  console.log(id, "<== id dari params nih brok");
  const [job, setJob] = useState<IAggregatedJob>();
  const [selectedSkill, setSelectedSkill] = useState("React");

  // const [prepareList, setPrepareList] = useState(job.prepareList);

  // const toggleTask = (index: number) => {
  //   const updatedList = [...prepareList];
  //   updatedList[index].completed = !updatedList[index].completed;
  //   setPrepareList(updatedList);
  // };
  // const completedTasks = prepareList.filter((item) => item.completed).length;
  // const totalTasks = prepareList.length;
  // const progressPercentage = (completedTasks / totalTasks) * 100;
  useEffect(() => {
    async function fetchJob() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      setJob(data.data);
    }
    fetchJob();
  }, []);

  if (!job) {
    return <div className="text-center py-10">Loading...</div>;
  }
  console.log(job, "< jing");

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

          {/* Requirement */}
          <div>
            <h1 className="text-xl font-bold">Requirement</h1>
            {job.requirements?.map((req: string, i: number) => (
              <li key={i}>{req}</li>
            ))}
          </div>
          {/* Tests to Take */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tests to take:</h3>
            <Accordion type="single" collapsible className="w-full">
              {job.tests.map((test, i) => (
                <AccordionItem value={test.category} key={i}>
                  <AccordionTrigger>
                    <Link href={`/test/${test._id}`}>
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
          {/* To Prepare List */}
          {/* <div>
            <h3 className="text-lg font-medium mb-2">To prepare list:</h3>
            <ul className="space-y-2">
              {prepareList.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleTask(index)}
                  />
                  <span
                    className={
                      item.completed ? "line-through text-muted-foreground" : ""
                    }
                  >
                    {item.task}
                  </span>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Overall Progress  */}
          {/* <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Overall Progress</h3>
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </Card> */}

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
                    {Object.entries(job.tests).map(({category, score}) => (
                      <div
                        key={category}
                        className="flex justify-between items-center mb-2"
                      >
                        <span>{category}</span>
                        <Progress value={score* 100} className="w-1/2" />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="h-64">
              <RadarChart data={job.tests} skillName={selectedSkill} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
