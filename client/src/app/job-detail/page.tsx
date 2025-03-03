"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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

// Sample job data - in a real app this would come from a database or API
const jobData = {
  title: "Software Engineer",
  company: "Traveloka",
  readiness: 80,
  prepareList: [
    { task: "3 hours of Coding a day minimum", completed: false },
    { task: "Read documentation of MongoDB", completed: false },
    { task: "Understanding REST API", completed: false },
    {
      task: "Build a sample project using React and Node.js",
      completed: false,
    },
    { task: "Practice system design questions", completed: false },
  ],
  testsToTake: [
    {
      name: "React",
      description:
        "Test your knowledge of React components, hooks, and state management.",
    },
    {
      name: "NodeJS",
      description:
        "Assess your understanding of server-side JavaScript and Node.js ecosystem.",
    },
    {
      name: "MongoDB",
      description:
        "Evaluate your skills in working with NoSQL databases and MongoDB queries.",
    },
    {
      name: "Express",
      description:
        "Test your ability to build RESTful APIs using Express.js framework.",
    },
  ],
  requirements: [
    "Bachelor’s degree in Computer Science, Engineering, or related field (or equivalent practical experience)",
    "5+ years of professional experience as a software developer",
    "Proficiency in Django",
    "Solid understanding of RESTful APIs",
    "Experience with front-end technologies like JavaScript, HTML5, and CSS3 is a plus",
    "Familiarity with modern DevOps practices, including Docker and CI/CD pipelines",
    "Good command in English (Speaking and Written)",
  ],
  skills: {
    React: 0.8,
    PostgreSQL: 0.6,
    Insight: 0.7,
    Express: 0.5,
    GraphQL: 0.7,
    NodeJS: 0.9,
  },
};

export default function JobDetailsPage() {
  const [selectedSkill, setSelectedSkill] = useState("React");
  const [prepareList, setPrepareList] = useState(jobData.prepareList);

  const toggleTask = (index: number) => {
    const updatedList = [...prepareList];
    updatedList[index].completed = !updatedList[index].completed;
    setPrepareList(updatedList);
  };

  const completedTasks = prepareList.filter((item) => item.completed).length;
  const totalTasks = prepareList.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Job Title and Company */}
          <div>
            <h1 className="text-3xl font-bold">{jobData.title}</h1>
            <h2 className="text-xl text-muted-foreground">{jobData.company}</h2>
          </div>

          {/* Requirement */}
          <div>
            <h1 className="text-xl font-bold">Requirement</h1>
            {jobData.requirements.map((el, i) => (
              <ol className="text-muted-foreground">
                <li>{el}</li>
              </ol>
            ))}
          </div>
          {/* Tests to Take */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tests to take:</h3>
            <Accordion type="single" collapsible className="w-full">
              {jobData.testsToTake.map((test) => (
                <AccordionItem value={test.name} key={test.name}>
                  <AccordionTrigger>
                    <Badge
                      variant={
                        selectedSkill === test.name ? "default" : "secondary"
                      }
                      className="px-4 py-2 text-base cursor-pointer"
                      onClick={() => setSelectedSkill(test.name)}
                    >
                      {test.name}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>{test.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* To Prepare List */}
          <div>
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
          </div>

          {/* Overall Progress  */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Overall Progress</h3>
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </Card>

          {/* Readiness Chart */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Readiness: {jobData.readiness}%
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
                    {Object.entries(jobData.skills).map(([skill, value]) => (
                      <div
                        key={skill}
                        className="flex justify-between items-center mb-2"
                      >
                        <span>{skill}</span>
                        <Progress value={value * 100} className="w-1/2" />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="h-64">
              <RadarChart data={jobData.skills} skillName={selectedSkill} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
