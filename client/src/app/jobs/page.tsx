import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/ui/JobsCard";
import { Filter } from "lucide-react";

const jobs = [
  {
    id: 1,
    company: "PT Mindo Small Business Solutions",
    position: "Senior Software Developer (Python/Django)",
    skills: [
      "Python",
      "Django",
      "PostgreSQL",
      "Docker",
      "HTML",
      "CSS",
      "Tailwind",
      "JavaScript",
    ],
    status: "ongoing",
  },
  {
    id: 2,
    company: "Tech Innovators Inc.",
    position: "Frontend Developer",
    skills: ["React", "TypeScript", "HTML", "CSS", "Tailwind", "JavaScript"],
    status: "applied",
  },
  {
    id: 3,
    company: "Global Systems Ltd.",
    position: "Full Stack Engineer",
    skills: ["Node.js", "Express", "MongoDB", "React", "JavaScript", "AWS"],
    status: "interview-scheduled",
  },
  {
    id: 4,
    company: "Data Solutions Co.",
    position: "Data Engineer",
    skills: ["Python", "SQL", "Spark", "Hadoop", "AWS", "ETL"],
    status: "rejected",
  },
  {
    id: 5,
    company: "Mobile Creations",
    position: "Mobile Developer",
    skills: ["React Native", "Swift", "Kotlin", "JavaScript", "Firebase"],
    status: "offer-received",
  },
];
export default function Jobs() {
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
          <Button variant="outline">Add Jobs</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
