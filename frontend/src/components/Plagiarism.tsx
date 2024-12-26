import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileDown, Edit, Check } from "lucide-react";

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

const Plagiarism = ({ isDarkMode }: { isDarkMode: boolean }) => {
	const [textContent, setTextContent] = useState("");
	const [topSources, setTopSources] = useState<Source[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedSource, setSelectedSource] = useState<number | null>(null);
	const [highlightedText, setHighlightedText] = useState("");
	const [scanResult, setScanResult] = useState<ScanResult | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [creditsRemaining, setCreditsRemaining] = useState(0);

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

			if (data?.data?.response?.error == "INSUFFICIENT_CREDIT")
				setError(
					"Insufficient credits to perform the scan. Please try again later."
				);

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
			setIsEditing(false);
			setCreditsRemaining(data?.data?.credits_remaining || 0);
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
				const content = (e.target?.result as string) || "";
				setTextContent(content);
				setHighlightedText(content);
			};
			reader.readAsText(file);
		}
	};

	const handleSourceSelect = (index: number) => {
		if (isEditing) return; // Prevent source selection while editing
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

	const handleTextContentChange = (newContent: string) => {
		setTextContent(newContent);
		setHighlightedText(newContent);
	};

	const toggleEdit = () => {
		if (isEditing) {
			// If we're finishing editing, update the highlighted text
			setHighlightedText(textContent);
		}
		setIsEditing(!isEditing);
		setSelectedSource(null);
	};

	const exportReport = () => {
		if (!scanResult) return;

		const report = `
Plagiarism Analysis Report
-------------------------
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Overall Similarity: ${scanResult.score}%
Total Words: ${scanResult.textWordCounts}
Matching Words: ${scanResult.totalPlagiarismWords}
Identical Words: ${scanResult.identicalWordCounts}
Similar Words: ${scanResult.similarWordCounts}

Top Sources:
${topSources
	.map(
		(source, index) => `
${index + 1}. ${source.url}
   Similarity: ${source.percentage}%
   Title: ${source.title}
   Description: ${source.description}
`
	)
	.join("\n")}

Analyzed Text:
${textContent}
        `;

		const blob = new Blob([report], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "plagiarism-report.txt";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div
			className={`space-y-6 lg:p-4 lg:max-w-4xl lg:mx-auto ${
				isDarkMode ? "dark" : ""
			}`}
		>
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-bold">Plagiarism Checker</h2>
			</div>

			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{scanResult && (
				<>
					<Card className={isDarkMode ? "dark:bg-gray-900/70" : ""}>
						<CardContent className="pt-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div
									className={`text-center p-4 rounded-lg shadow-sm ${
										isDarkMode
											? "border dark:bg-gray-900/70 border-gray-700"
											: ""
									}`}
								>
									<div className="text-2xl font-bold text-blue-600">
										{scanResult.score}%
									</div>
									<div className="text-sm">
										Overall Similarity
									</div>
								</div>
								<div
									className={`text-center p-4 rounded-lg shadow-sm ${
										isDarkMode
											? "border dark:bg-gray-900/70 border-gray-700"
											: ""
									}`}
								>
									<div className="text-2xl font-bold text-green-600">
										{scanResult.textWordCounts}
									</div>
									<div className="text-sm">Total Words</div>
								</div>
								<div
									className={`text-center p-4 rounded-lg shadow-sm ${
										isDarkMode
											? "border dark:bg-gray-900/70 border-gray-700"
											: ""
									}`}
								>
									<div className="text-2xl font-bold text-orange-600">
										{scanResult.totalPlagiarismWords}
									</div>
									<div className="text-sm">
										Matching Words
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Credits Section */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
						<Card
							className={isDarkMode ? "dark:bg-gray-900/70" : ""}
						>
							<CardContent className="p-4 text-center">
								<div className="text-2xl font-bold text-green-600">
									{creditsRemaining}
								</div>
								<div className="text-sm">Credits Remaining</div>
							</CardContent>
						</Card>
						<Card
							className={isDarkMode ? "dark:bg-gray-900/70" : ""}
						>
							<CardContent className="p-4 text-center">
								<div className="text-2xl font-bold text-red-600">
									{2500 - creditsRemaining}
								</div>
								<div className="text-sm">Credits Used</div>
							</CardContent>
						</Card>
					</div>
				</>
			)}

			<div className="space-y-2">
				<div className="flex justify-between items-center">
					<label className="text-sm font-medium">Text Content</label>
					{topSources.length > 0 && (
						<Button
							variant="outline"
							size="sm"
							onClick={toggleEdit}
							className="flex items-center gap-2"
						>
							{isEditing ? (
								<>
									<Check className="w-4 h-4" />
									Done
								</>
							) : (
								<>
									<Edit className="w-4 h-4" />
									Edit
								</>
							)}
						</Button>
					)}
				</div>
				{topSources.length > 0 ? (
					isEditing ? (
						<Textarea
							value={textContent}
							onChange={(e) =>
								handleTextContentChange(e.target.value)
							}
							className="min-h-[200px]"
						/>
					) : (
						<div
							className={`min-h-[200px] p-4 border rounded-md whitespace-pre-wrap ${
								isDarkMode ? "dark" : ""
							}`}
							dangerouslySetInnerHTML={{
								__html: highlightedText,
							}}
						/>
					)
				) : (
					<Textarea
						value={textContent}
						onChange={(e) =>
							handleTextContentChange(e.target.value)
						}
						placeholder="Enter or paste your text here to check for plagiarism..."
						className="min-h-[200px]"
					/>
				)}
			</div>

			<div className="flex items-center my-4">
				<div className="flex-grow border-t border-gray-300"></div>
				<span className="mx-4 text-gray-500 text-sm font-medium">
					OR
				</span>
				<div className="flex-grow border-t border-gray-300"></div>
			</div>

			<div className="flex justify-center items-center h-full gap-4">
				<Button variant="outline" className="w-64">
					<label className="cursor-pointer">
						<input
							type="file"
							accept=".txt,.docx,.pdf"
							className="hidden w-full"
							onChange={handleFileUpload}
						/>
						Upload File
					</label>
				</Button>
				{scanResult && (
					<Button variant="outline" onClick={exportReport}>
						<FileDown className="w-4 h-4 mr-2" />
						Export Report
					</Button>
				)}
			</div>

			<Button
				className="w-1/2 mx-auto flex"
				onClick={handleScan}
				disabled={isLoading}
			>
				{isLoading ? "Scanning..." : "Scan Now"}
			</Button>

			<div className="space-y-4">
				<h3 className="text-sm font-medium">Top Sources</h3>
				<div className="space-y-2">
					{topSources.length > 0 ? (
						topSources.map((source, index) => (
							<Card
								key={index}
								className={`cursor-pointer overflow-hidden transition-colors hover ${
									selectedSource === index
										? "bg-blue-50 border-blue-200"
										: isDarkMode
										? "hover:bg-gray-900"
										: "hover:bg-gray-50"
								} ${isDarkMode ? "bg-gray-950" : ""}`}
								onClick={() => handleSourceSelect(index)}
							>
								<CardContent className="p-3 lg:p-4">
									<div className="flex flex-wrap text-sm lg:text-lg justify-between items-start ">
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
											<div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
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
