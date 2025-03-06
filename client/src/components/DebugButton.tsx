"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bug,
  Database,
  X,
  NotebookPenIcon,
  LucideVerified,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DebugButton({
  handlePopulateConcepts,
  handleGenerateReadiness,
  handleGenerateAnswers,
  handleAddQuota,
}: {
  handlePopulateConcepts?: () => Promise<void>;
  handleGenerateReadiness?: () => Promise<void>;
  handleGenerateAnswers?: () => Promise<void>;
  handleAddQuota?: () => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [buttonColor, setButtonColor] = useState("bg-primary");

  const handleCommand = async (command: string) => {
    console.log(`Executing command: ${command}`);
    // Here you would implement the actual command functionality
    switch (command) {
      case "populateConcepts":
        console.log("Populating concept answers...");
        if (handlePopulateConcepts) await handlePopulateConcepts();
        setButtonColor("bg-green-500");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setButtonColor("bg-primary");
        break;
      case "generateAnswers":
        console.log("Generating answers...");
        if (handleGenerateAnswers) await handleGenerateAnswers();
        setButtonColor("bg-yellow-500");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setButtonColor("bg-primary");
        break;
      case "generateReadiness":
        console.log("Generating readiness...");
        if (handleGenerateReadiness) await handleGenerateReadiness();
        setButtonColor("bg-yellow-500");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setButtonColor("bg-primary");
        break;
      case "addQuota":
        if (handleAddQuota) await handleAddQuota();
        console.log("Adding quota...");
        setButtonColor("bg-yellow-500");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setButtonColor("bg-primary");
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu with escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const commands = [
    {
      id: "populateConcepts",
      icon: <NotebookPenIcon className="w-4 h-4" />,
      label: "pop_concepts",
    },
    {
      id: "generateAnswers",
      icon: <Database className="w-4 h-4" />,
      label: "gen_answers",
    },
    {
      id: "generateReadiness",
      icon: <LucideVerified className="w-4 h-4" />,
      label: "gen_readiness",
    },
    { id: "addQuota", icon: <CreditCard className="w-4 h-4" />, label: "add_quota" },
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-4 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={buttonRef}
              variant="default"
              size="icon"
              className={`rounded-full shadow-lg ${buttonColor} hover:bg-primary/90`}
              onClick={toggleMenu}
              aria-label="Debug Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Bug className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Debug Tools</p>
          </TooltipContent>
        </Tooltip>

        {isOpen && (
          <Card
            ref={menuRef}
            className="absolute bottom-16 left-0 p-2 w-48 grid grid-cols-2 gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-200"
          >
            {commands.map((command) => (
              <Tooltip key={command.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center justify-center h-16 gap-1 hover:bg-muted"
                    onClick={() => handleCommand(command.id)}
                  >
                    {command.icon}
                    <span className="text-xs">{command.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{command.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
