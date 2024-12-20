'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

const urlLinks = [
  "https://example.com/source1",
  "https://example.com/source2"
]

export default function ContentAnalyzer() {
  const [selectedTool, setSelectedTool] = useState('plagiarism')
  // const [urlLinks, setUrlLinks] = useState<string[]>([])

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-center">AI Content Detector</h1>
          <Select 
            defaultValue={selectedTool} 
            onValueChange={setSelectedTool}
          >
            <SelectTrigger className="w-full max-w-xs mx-auto">
              <SelectValue placeholder="Select tool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plagiarism">Plagiarism Detector</SelectItem>
              <SelectItem value="summarizer">Text Summarizer</SelectItem>
              <SelectItem value="ai-detector">AI Content Detector</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-6">
            {selectedTool === 'plagiarism' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Text Content
                  </label>
                  <Textarea
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
                <Button className="w-full">
                  Scan Now
                </Button>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">URL Links from where copied</h3>
                  <div className="space-y-2">
                    {urlLinks.length > 0 ? (
                      urlLinks.map((url, index) => (
                        <div key={index} className="p-2 bg-gray-100 rounded text-sm">
                          {url}
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
            )}

            {selectedTool === 'summarizer' && (
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
                <Button className="w-full">
                  Summarize Now
                </Button>
              </div>
            )}

            {selectedTool === 'ai-detector' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Text Content
                  </label>
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
                <Button className="w-full">
                  Analyze Now
                </Button>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-center text-sm text-gray-500">
                    AI probability score will appear here
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

