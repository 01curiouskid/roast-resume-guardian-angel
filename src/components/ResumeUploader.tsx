
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface ResumeUploaderProps {
  onResumeProcessed: (text: string) => void;
}

export function ResumeUploader({ onResumeProcessed }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file is PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Read file as text using FileReader
      const text = await extractTextFromPDF(file);
      
      if (text.trim().length < 50) {
        toast({
          title: "Not enough text",
          description: "We couldn't extract enough text from your PDF. Please try another file.",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }
      
      onResumeProcessed(text);
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast({
        title: "Error processing PDF",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  // Function to extract text from PDF using browser's FileReader API
  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          // Import PDF.js dynamically to avoid SSR issues
          const pdfjs = await import('pdfjs-dist');
          
          // Set worker path for PDF.js
          const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
          pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
          
          // Load PDF document
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          
          let fullText = '';
          
          // Extract text from all pages
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText);
        } catch (error) {
          console.error("Error extracting text from PDF:", error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <label 
        htmlFor="resume-upload"
        className="block w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium cursor-pointer transition-colors"
      >
        {isUploading ? "Processing..." : "Upload Your Resume"}
        <input
          id="resume-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
        />
      </label>
      <p className="mt-3 text-purple-300 text-sm">PDF format only</p>
    </div>
  );
}
