import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

// Define the type for the source
type Source = {
    url: string;
    percentage: string;
};

type APIResponseSource = {
    url: string;
    plagiarismWords: number;
};

const Plagiarism: React.FC = () => {
    const [textContent, setTextContent] = useState<string>("");
    const [topSources, setTopSources] = useState<Source[]>([]); // Define the type for the topSources array
    const [isScanning, setIsScanning] = useState<boolean>(false);

    const handleScan = async () => {
        if (!textContent.trim()) {
            alert("Please enter some text to scan.");
            return;
        }

        setIsScanning(true);
        try {
            const response = await fetch(
                "https://plag-check-h7lh.vercel.app/plag-detect?contentFormat=text&checkOption=plagiarism",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: textContent }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch results. Please try again.");
            }

            const data = await response.json();
            const sources: APIResponseSource[] = data.data.sources;

            // Calculate plagiarism percentages and sort the sources
            const sortedSources: Source[] = sources
                .filter((source) => source.plagiarismWords > 0) // Only include sources with detected plagiarism
                .map(
                    (source): Source => ({
                        url: source.url,
                        percentage: (
                            (source.plagiarismWords /
                                data.data.result.textWordCounts) *
                            100
                        ).toFixed(2),
                    })
                )
                .sort(
                    (a: Source, b: Source) =>
                        parseFloat(b.percentage) - parseFloat(a.percentage)
                )
                .slice(0, 3); // Top 3 sources

            setTopSources(sortedSources);
        } catch (error) {
            console.error("Error scanning for plagiarism:", error);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Text Content</label>
                <Textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter or paste your text here to check for plagiarism..."
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
            <Button
                className="w-full"
                onClick={handleScan}
                disabled={isScanning}
            >
                {isScanning ? "Scanning..." : "Scan Now"}
            </Button>
            <div className="space-y-2">
                <h3 className="text-sm font-medium">
                    Top Sources with Plagiarism
                </h3>
                <div className="space-y-2">
                    {topSources.length > 0 ? (
                        topSources.map((source, index) => (
                            <div
                                key={index}
                                className="p-2 bg-gray-100 rounded text-sm"
                            >
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    {source.url}
                                </a>
                                <span className="ml-2">
                                    - {source.percentage}%
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">
                            No URLs detected yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Plagiarism;
