import React from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

const Summarizer = () => {
    return (
        <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Original Text Content
                    </label>
                    <Textarea
                        placeholder="Enter or paste your text here to summarize..."
                        className="min-h-[200px]"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Summarized Content
                    </label>
                    <Textarea
                        readOnly
                        placeholder="Summary will appear here..."
                        className="min-h-[200px] bg-gray-50"
                    />
                </div>
            </div>
            <Button className="w-full">Summarize Now</Button>
        </div>
    );
};

export default Summarizer;
