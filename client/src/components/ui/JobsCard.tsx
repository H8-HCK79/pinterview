import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Briefcase, Building2 } from "lucide-react";
import moment from "moment";

type Job = {
  _id: string;
  company: string;
  position: string;
  skills: string[];
  status: string;
  readiness: number;
  createdAt: string;
};

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const getReadinessColor = (readiness: number) => {
    if (readiness < 33) return "bg-red-500";
    if (readiness < 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="h-full flex flex-col shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:shadow-xl duration-300 bg-white/90">
      {/* Card Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-blue-700">
              {job.position}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Building2 className="h-4 w-4 mr-1 text-gray-500" />
              {job.company}
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="flex-grow p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Briefcase className="h-4 w-4 text-gray-500" />
            Required Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Readiness Bar */}
          <div className="mt-3">
            <p className="text-sm text-gray-700 font-medium">
              Readiness: {job.readiness}%
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div
                className={`h-2 rounded-full ${getReadinessColor(
                  job.readiness
                )}`}
                style={{ width: `${job.readiness}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="pt-3 border-t bg-gray-100 rounded-b-xl">
        <div className="flex justify-between w-full">
          <p className="text-gray-500 text-sm italic">
            {moment(job.createdAt).fromNow()}
          </p>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition-all">
            View Details
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Status Badge Component
export function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Ready to apply":
        return {
          label: "Ready to Apply",
          color: "bg-green-100 text-green-700",
        };
      case "Pending":
        return { label: "Pending", color: "bg-yellow-100 text-yellow-700" };
      case "Interview":
        return { label: "Interview", color: "bg-blue-100 text-blue-700" };
      case "Rejected":
        return { label: "Rejected", color: "bg-red-100 text-red-700" };
      case "Accepted":
        return { label: "Accepted", color: "bg-green-100 text-green-700" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-md ${config.color}`}
    >
      {config.label}
    </span>
  );
}
