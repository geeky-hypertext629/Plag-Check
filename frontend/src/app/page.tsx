"use client";

import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Plagiarism from "@/components/Plagiarism";
import Summarizer from "@/components/Summarizer";
import AiDetector from "@/components/AiDetector";
import { Sun, Moon } from "lucide-react";

export default function ContentAnalyzer() {
    const [selectedTool, setSelectedTool] = useState("plagiarism");
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load dark mode preference
    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode") === "true";
        setIsDarkMode(savedMode);
    }, []);

    // Save dark mode preference
    useEffect(() => {
        localStorage.setItem("darkMode", isDarkMode.toString());
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

    return (
        <div
            className={`min-h-screen p-4 md:p-8 ${
                isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-gray-100 text-gray-900"
            }`}
        >
            {/* Dark Mode Toggle Icon */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? (
                        <Sun className="w-6 h-6 text-yellow-400" />
                    ) : (
                        <Moon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
                    )}
                </button>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-3xl font-bold text-center">
                        AI Content Detector
                    </h1>
                    <div className="flex justify-center items-center border border-gray-300 rounded-md max-w-fit">
                        <Select
                            defaultValue={selectedTool}
                            onValueChange={setSelectedTool}
                        >
                            <SelectTrigger className="w-full max-w-xs">
                                <SelectValue placeholder="Select tool" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="plagiarism">
                                    Plagiarism Detector
                                </SelectItem>
                                <SelectItem value="summarizer">
                                    Text Summarizer
                                </SelectItem>
                                <SelectItem value="ai-detector">
                                    AI Content Detector
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Content Section */}
                <Card>
                    <CardContent className="p-6">
                        {selectedTool === "plagiarism" && <Plagiarism />}
                        {selectedTool === "summarizer" && <Summarizer />}
                        {selectedTool === "ai-detector" && <AiDetector />}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
