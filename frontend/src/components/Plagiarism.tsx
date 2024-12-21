import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, ChevronDown } from "lucide-react";

interface PlagiarismFound {
    startIndex: number;
    endIndex: number;
    sequence: string;
}

interface Source {
    url: string;
    plagiarismWords: number;
    percentage?: string;
    plagiarismFound: PlagiarismFound[];
    description: string;
    title: string;
    publishedDate: string;
    source: string;
    author: string;
}

interface ScanResult {
    score: number;
    sourceCounts: number;
    textWordCounts: number;
    totalPlagiarismWords: number;
    identicalWordCounts: number;
    similarWordCounts: number;
}

const Plagiarism = () => {
    const [textContent, setTextContent] = useState("");
    const [topSources, setTopSources] = useState<Source[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSource, setSelectedSource] = useState<number | null>(null);
    const [highlightedText, setHighlightedText] = useState("");
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);

    const handleScan = async () => {
        if (!textContent.trim()) {
            alert("Please enter some text to scan.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "http://localhost:5000/plag-detect?contentFormat=text&checkOption=plagiarism",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: textContent }),
                }
            );
            const data = await response.json();

            const sources: Source[] = data?.data?.sources || [];
            const textWordCounts = data?.data?.result?.textWordCounts || 1;
            setScanResult(data?.data?.result || null);

            const processedSources = sources
                .filter((source) => source.plagiarismWords > 0)
                .map((source) => ({
                    ...source,
                    percentage: (
                        (source.plagiarismWords / textWordCounts) *
                        100
                    ).toFixed(2),
                }))
                .sort((a, b) => b.plagiarismWords - a.plagiarismWords)
                .slice(0, 3);

            setTopSources(processedSources);
            setSelectedSource(null);
            setHighlightedText(textContent);
        } catch (err) {
            setError("Failed to fetch data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTextContent((e.target?.result as string) || "");
                setHighlightedText((e.target?.result as string) || "");
            };
            reader.readAsText(file);
        }
    };

    const handleSourceSelect = (index: number) => {
        setSelectedSource(index);
        const source = topSources[index];
        if (!source || !source.plagiarismFound) {
            setHighlightedText(textContent);
            return;
        }

        const segments = [...source.plagiarismFound].sort(
            (a, b) => a.startIndex - b.startIndex
        );
        let result = textContent;
        let offset = 0;

        segments.forEach(({ startIndex, endIndex }) => {
            const before = result.slice(0, startIndex + offset);
            const match = result.slice(startIndex + offset, endIndex + offset);
            const after = result.slice(endIndex + offset);

            result =
                before +
                '<mark class="bg-yellow-200">' +
                match +
                "</mark>" +
                after;
            offset += '<mark class="bg-yellow-200">'.length + "</mark>".length;
        });

        setHighlightedText(result);
    };

    return (
        <div className="space-y-6 p-4 max-w-4xl mx-auto">
            {/* Text Content Display */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Text Content</label>
                {topSources.length > 0 ? (
                    <div
                        className="min-h-[200px] p-4 border rounded-md bg-white whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                    />
                ) : (
                    <Textarea
                        value={textContent}
                        onChange={(e) => {
                            setTextContent(e.target.value);
                            setHighlightedText(e.target.value);
                        }}
                        placeholder="Enter or paste your text here to check for plagiarism..."
                        className="min-h-[200px]"
                    />
                )}
            </div>

            {/* File Upload and URL Paste */}
            <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept=".txt,.docx,.pdf"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        Upload File
                    </label>
                </Button>
                <Button variant="outline" className="flex-1">
                    Paste URL
                </Button>
            </div>

            {/* Scan Button */}
            <Button
                className="w-full"
                onClick={handleScan}
                disabled={isLoading}
            >
                {isLoading ? "Scanning..." : "Scan Now"}
            </Button>

            {/* Error Message */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Scan Results Summary */}
            {scanResult && (
                <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-blue-600">
                                    {scanResult.score}%
                                </div>
                                <div className="text-sm text-gray-600">
                                    Overall Similarity
                                </div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-green-600">
                                    {scanResult.textWordCounts}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Words
                                </div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-orange-600">
                                    {scanResult.totalPlagiarismWords}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Matching Words
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Results */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium">Top Sources</h3>
                <div className="space-y-2">
                    {topSources.length > 0 ? (
                        topSources.map((source, index) => (
                            <Card
                                key={index}
                                className={`cursor-pointer transition-colors ${
                                    selectedSource === index
                                        ? "bg-blue-50 border-blue-200"
                                        : "hover:bg-gray-50"
                                }`}
                                onClick={() => handleSourceSelect(index)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="font-medium">
                                                {source.title || source.url}
                                            </div>
                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 hover:underline"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                {source.url}
                                            </a>
                                            {source.description && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    {source.description}
                                                </p>
                                            )}
                                            <div className="flex gap-4 text-sm text-gray-500 mt-2">
                                                {source.author !==
                                                    "unknown" && (
                                                    <span>
                                                        Author: {source.author}
                                                    </span>
                                                )}
                                                {source.publishedDate !==
                                                    "unknown" && (
                                                    <span>
                                                        Published:{" "}
                                                        {source.publishedDate}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {source.percentage}%
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">
                            No sources detected yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Plagiarism;
