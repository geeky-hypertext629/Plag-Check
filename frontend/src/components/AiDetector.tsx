import React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const AiDetector = () => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Text Content</label>
                <Textarea
                    placeholder="Enter or paste your text here to detect AI-generated content..."
                    className="min-h-[200px]"
                />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                    Upload File
                </Button>
                <Button variant="outline" className="flex-1">
                    Paste URL
                </Button>
            </div>
            <Button className="w-full">Analyze Now</Button>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-center text-sm text-gray-500">
                    AI probability score will appear here
                </p>
            </div>
        </div>
    );
};

export default AiDetector;
