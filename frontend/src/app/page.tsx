"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

export default function ContentAnalyzer() {
    const [selectedTool, setSelectedTool] = useState("plagiarism");
    // const [urlLinks, setUrlLinks] = useState<string[]>([])

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 space-y-4">
                    <h1 className="text-3xl font-bold text-center">
                        AI Content Detector
                    </h1>
                    <Select
                        defaultValue={selectedTool}
                        onValueChange={setSelectedTool}
                    >
                        <SelectTrigger className="w-full max-w-xs mx-auto">
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
