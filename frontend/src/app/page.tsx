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
            className={`min-h-screen p-8 md:p-16 transition-colors duration-500 ${
                isDarkMode
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100"
                    : "bg-gradient-to-br from-blue-50 via-gray-100 to-blue-200 text-gray-900"
            }`}
        >
            {/* Floating Dark Mode Toggle */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-3 rounded-full bg-gradient-to-br from-gray-200 via-white to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:scale-110 transition-all duration-300 shadow-xl"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? (
                        <Sun className="w-6 h-6 text-yellow-400" />
                    ) : (
                        <Moon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
                    )}
                </button>
            </div>

            {/* Main Container */}
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-pink-500 dark:to-yellow-500">
                        AI Content Analyzer
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Simplify content analysis with cutting-edge tools for detecting plagiarism, summarizing text, and analyzing AI-generated content.
                    </p>
                </div>

                {/* Tool Selector */}
                <div className="relative z-10 flex justify-center">
                    <Select
                        defaultValue={selectedTool}
                        onValueChange={setSelectedTool}
                        
                    >
                        <SelectTrigger className="w-full max-w-md shadow-lg rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-xl transition-all duration-300">
                            <SelectValue placeholder="Select Tool" />
                        </SelectTrigger>
                        <SelectContent className="overflow-hidden rounded-lg shadow-xl">
                            <SelectItem value="plagiarism">
                                Plagiarism Detector
                            </SelectItem>
                            <SelectItem value="summarizer">Text Summarizer</SelectItem>
                            <SelectItem value="ai-detector">AI Content Detector</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Content Section */}
                <Card
                    className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-2xl border-none rounded-lg"
                >
                    <CardContent className="py-6">
                        {selectedTool === "plagiarism" && <Plagiarism isDarkMode = {isDarkMode} />}
                        {selectedTool === "summarizer" && <Summarizer />}
                        {selectedTool === "ai-detector" && <AiDetector />}
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            {/* <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
                Built with ❤️
            </footer> */}
        </div>
    );
}
