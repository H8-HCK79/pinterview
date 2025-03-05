"use client";
import Image from "next/image";
import { LinkPreview } from "@/components/ui/link-preview";
import { PlusCircle, Briefcase, Building, FileText } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

type Platforms = {
  name: string;
  image: string;
  url: string;
};

const platforms: Platforms[] = [
  {
    name: "Glassdoor",
    image: "/platform/glassdoor.png",
    url: "https://www.glassdoor.com",
  },
  { name: "Glints", image: "/platform/glints.png", url: "https://glints.com" },
  {
    name: "Jobstreet",
    image: "/platform/jobstreet.png",
    url: "https://www.jobstreet.co.id",
  },
  {
    name: "Kalibrr",
    image: "/platform/kalibrr.png",
    url: "https://www.kalibrr.com",
  },
  {
    name: "Karirhub Kemnaker",
    image: "/platform/karirhub-kemnaker.svg",
    url: "https://karirhub.kemnaker.go.id",
  },
  {
    name: "LinkedIn",
    image: "/platform/linkedin.png",
    url: "https://www.linkedin.com/jobs",
  },
];

export default function AddJobs() {
  const router = useRouter();
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [rawDescription, setRawDescription] = useState("");
  const [error, setError] = useState<string>("");
  const { user, fetchUser } = useUser(); // Get user context

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, company, rawDescription }),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error);
      }
      await fetchUser();

      router.push("/jobs");
    } catch (error: unknown) {
      console.log(error, "<== handle submit job");

      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  // console.log(role, company, rawDescription);

  return (
    <div className="flex  min-h-screen w-full overflow-hidden ">
      {/* Kiri */}
      <div className="bg-gradient-to-br from-[#0077b6] to-[#023e8a] flex flex-1  flex-col justify-center items-center px-10 relative rounded-r-3xl shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full "></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-300/10 rounded-full "></div>

        <div className=" w-full max-w-lg p-8 bg-white backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 rounded-full p-3 shadow-lg">
            <PlusCircle size={32} className="text-white" />
          </div>

          <h2 className="text-xl font-bold  text-center mt-4">
            Add a Job Listing
          </h2>

          {error ? (
            <div role="alert" className="alert alert-error my-4 h-10 flex">
              <span>{error}</span>
            </div>
          ) : (
            ""
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="group">
              <label className="flex items-center gap-2 text-xl font-medium mb-2">
                <Briefcase className="text-blue-800" size={20} />
                Role
              </label>
              <input
                type="text"
                className="w-full bg-white/90 p-4 border border-blue-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner transition-all duration-200 placeholder:text-gray-400"
                placeholder="e.g., Software Engineer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-xl font-medium  mb-2">
                <Building className="text-blue-700" size={20} />
                Company
              </label>
              <input
                type="text"
                className="w-full bg-white/90 p-4 border border-blue-500 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner transition-all duration-200 placeholder:text-gray-400"
                placeholder="e.g., Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-xl font-medium  mb-2">
                <FileText className="text-blue-700" size={20} />
                Description / Qualification / Responsibility
              </label>
              <textarea
                className="w-full bg-white/90 p-4 border border-blue-200 text-gray-800 rounded-xl h-36 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner transition-all duration-200 resize-none placeholder:text-gray-400"
                placeholder="Enter job details..."
                value={rawDescription}
                onChange={(e) => setRawDescription(e.target.value)}
              />
            </div>

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex justify-center items-center gap-2">
              <PlusCircle size={20} />
              Submit Job Listing
            </button>
          </form>
        </div>
      </div>

      {/* Kanan */}
      <div className="flex-1  flex items-center shadow-2xl justify-center">
        <div className="container mx-auto px-10">
          <h1 className="text-gray-800 text-xl font-sans font-bold">
            Find Job Openings...
          </h1>
          <p className="text-lg mt-5">
            <span className="font-semibold">Tip!</span> To make your job search
            easier, look for job openings on job search platforms like the ones
            below. Then, copy the job description, responsibilities, and
            requirements into the form to generate relevant questions.
          </p>

          {/* Job platforms */}
          <div className="flex flex-wrap gap-5 mt-10">
            {platforms.map((platform, index) => (
              <LinkPreview
                url={platform.url}
                key={index}
  
                className="flex items-center border p-3 rounded-xl shadow-lg w-fit"
              >
                <Image
                  src={platform.image}
                  width={150}
                  height={150}
                  alt={platform.name}
                />
              </LinkPreview>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
