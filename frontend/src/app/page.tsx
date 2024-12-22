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
            className={`min-h-screen p-6 md:p-12 transition-colors duration-300 ${
                isDarkMode
                    ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100"
                    : "bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50 text-gray-900"
            }`}
        >
            {/* Dark Mode Toggle */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:shadow-md transition-all duration-200"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? (
                        <Sun className="w-6 h-6 text-yellow-400" />
                    ) : (
                        <Moon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
                    )}
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                        AI Content Analyzer
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Detect plagiarism, summarize text, and analyze AI-generated content with ease.
                    </p>
                </div>

                {/* Tool Selector */}
                <div className="flex justify-center items-center">
                    <Select
                        defaultValue={selectedTool}
                        onValueChange={setSelectedTool}
                        className="relative z-10"
                    >
                        <SelectTrigger className="w-full max-w-xs shadow-lg rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                            <SelectValue placeholder="Select Tool" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="plagiarism">
                                Plagiarism Detector
                            </SelectItem>
                            <SelectItem value="summarizer">Text Summarizer</SelectItem>
                            <SelectItem value="ai-detector">AI Content Detector</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Content Section */}
                <Card className="shadow-lg rounded-lg">
                    <CardContent className="p-8 bg-white dark:bg-gray-800">
                        {selectedTool === "plagiarism" && <Plagiarism />}
                        {selectedTool === "summarizer" && <Summarizer />}
                        {selectedTool === "ai-detector" && <AiDetector />}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
