import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Code,
  Briefcase,
  CheckCircle,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
type Member = {
  name: string;
  image: string;
};

const member: Member[] = [
  { name: "Muhamad Fiqih Ikhsan", image: "fiqih.png" },
  { name: "Danish Rafie Al Rasyad", image: "danish.png" },
  { name: "Zhafran Muhammad Irsyad", image: "japran.jpg" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-16">
          <h2 className="bg-clip-text text-gray-800 text-2xl text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            Master Tech Interviews <br /> with Pinterview
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center mb-6">
            The ultimate platform for developers to practice technical
            interviews, strengthen coding concepts, and organize your job search
            journey—all in{" "}
            <span className="font-bold text-xl"> in one place.</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800">
              <Code className="w-10 h-10 text-[#0077b6] mb-2" />
              <h3 className="font-medium text-lg mb-1">Technical Practice</h3>
              <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
                Practice coding challenges and algorithms with real interview
                questions
              </p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800">
              <CheckCircle className="w-10 h-10 text-[#0077b6] mb-2" />
              <h3 className="font-medium text-lg mb-1">Concept Mastery</h3>
              <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
                Strengthen your understanding of key programming concepts and
                patterns
              </p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800">
              <Briefcase className="w-10 h-10 text-[#0077b6] mb-2" />
              <h3 className="font-medium text-lg mb-1">Application Tracker</h3>
              <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
                Organize and track your job applications in one centralized
                dashboard
              </p>
            </div>
          </div>
          {/* 
          <p className="max-w-xl mx-auto text-sm md:text-base text-neutral-700 dark:text-neutral-400 text-center mb-6">
            Join thousands of developers who have successfully landed their dream jobs by preparing with Pinterview's
            comprehensive interview preparation system.
          </p> */}

          <Link href={"/login"}>
            <Button className="px-8 py-6 bg-[#0077b6] relative z-50 text-white font-sans text-xl border-indigo-500 hover:bg-[#00b4d8]">
              Start Practicing Now
            </Button>
          </Link>
        </BackgroundLines>
      </main>

      <section
        id="about"
        className="pb-16 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              About Pinterview
            </h2>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/3">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#0077b6] to-[#00b4d8] flex items-center justify-center">
                    <img
                      src="/belakang.png"
                      alt="Hacktiv8 Logo"
                      className=" object-contain"
                    />
                  </div>
                </div>

                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                    Final Project by Hacktiv8 HCK 79
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Pinterview was developed as a final project by the talented
                    students of Hacktiv8's HCK 79 cohort. Our mission was to
                    create a comprehensive platform that helps developers
                    prepare for technical interviews and streamline their job
                    application process.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    This project showcases our skills in modern web development
                    using React, Next.js, and other cutting-edge technologies
                    while solving a real problem faced by developers in the job
                    market.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="https://github.com/hacktiv8-hck79"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        Project Repository
                      </Button>
                    </Link>
                    <Link
                      href="https://www.hacktiv8.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <img
                          src="/hacktiv8.png"
                          alt="Hacktiv8 Logo"
                          className=" w-14 h-14"
                        />
                        Hacktiv8
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Meet Our Team
              </h3>
              <div className="flex justify-between">
                {member.map((mem, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 mb-3 overflow-hidden">
                      <img
                        src={mem.image}
                        alt={mem.name}
                        className=" object-fill"
                      />
                    </div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {mem.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Developer
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Pinterview</h3>
              <p className="text-gray-400 text-sm">
                © 2025 Hacktiv8 HCK 79. All rights reserved.
              </p>
            </div>

            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
