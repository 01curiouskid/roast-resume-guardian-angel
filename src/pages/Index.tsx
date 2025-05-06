
import { useState } from 'react';
import { Header } from '@/components/Header';
import { ResumeUploader } from '@/components/ResumeUploader';
import { LoadingScreen } from '@/components/LoadingScreen';
import { RoastDisplay } from '@/components/RoastDisplay';
import { IntensityToggle } from '@/components/IntensityToggle';
import { getRoast } from '@/services/resumeService';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [roast, setRoast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [intensity, setIntensity] = useState<'spicy' | 'extra-spicy'>('spicy');

  const handleResumeProcessed = async (text: string) => {
    setResumeText(text);
    try {
      setIsLoading(true);
      const roastResult = await getRoast(text, intensity);
      setRoast(roastResult);
    } catch (error) {
      console.error('Error getting roast:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate roast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResumeText(null);
    setRoast(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex flex-col items-center px-4 py-10">
      <Header />
      
      {!resumeText && !roast && (
        <div className="w-full max-w-3xl mt-8">
          <IntensityToggle intensity={intensity} setIntensity={setIntensity} />
          <ResumeUploader onResumeProcessed={handleResumeProcessed} />
          
          <div className="mt-12 text-center text-white">
            <h2 className="text-xl font-semibold mb-4">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2">1️⃣</div>
                <p>Upload your resume PDF</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2">2️⃣</div>
                <p>AI analyzes and roasts it</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-3xl mb-2">3️⃣</div>
                <p>Share the roast with friends</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading && <LoadingScreen />}
      
      {roast && !isLoading && (
        <div className="w-full max-w-3xl mt-8">
          <RoastDisplay roast={roast} onReset={handleReset} />
        </div>
      )}
      
      <footer className="mt-auto pt-8 text-center text-purple-300 text-sm">
        <p>Created for entertainment purposes only. No resumes were harmed in the making of this app.</p>
      </footer>
    </div>
  );
};

export default Index;
