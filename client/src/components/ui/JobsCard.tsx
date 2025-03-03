import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Briefcase, Building2 } from "lucide-react";

type Job = {
  id: number;
  company: string;
  position: string;
  skills: string[];
  status: string;
};

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="h-full flex flex-col ">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-tight">
              {job.position}
            </h3>
            <div className="flex items-center text-muted-foreground">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-sm">{job.company}</span>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Required Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="flex justify-between w-full">
          <button className="text-sm text-primary hover:underline">
            View Details
          </button>
          <button className="text-sm text-primary hover:underline">
            Prepare Interview
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "on-going":
        return { label: "On-going", variant: "default" };
      case "applied":
        return { label: "Applied", variant: "secondary" };
      case "interview-scheduled":
        return { label: "Interview Scheduled", variant: "warning" };
      case "rejected":
        return { label: "Rejected", variant: "destructive" };
      case "offer-received":
        return { label: "Offer Received", variant: "success" };
      default:
        return { label: status, variant: "outline" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant as any} className="capitalize">
      {config.label}
    </Badge>
  );
}
