
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon
} from 'react-share';

interface RoastDisplayProps {
  roast: string;
  onReset: () => void;
}

export function RoastDisplay({ roast, onReset }: RoastDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roast);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareUrl = window.location.href;
  const title = "Check out my resume roast! 🔥";

  // Format the roast text to ensure paragraphs are preserved
  const formattedRoast = roast.split('\n').map((paragraph, index) => (
    paragraph.trim() ? (
      <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
    ) : null
  )).filter(Boolean);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Your Resume Roast:</h2>
      <div className="bg-gray-700 rounded-lg p-4 mb-6 max-h-[60vh] overflow-y-auto">
        <div className="text-white">{formattedRoast}</div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            {isCopied ? "Copied!" : "Copy to Clipboard"}
          </Button>
          <Button variant="outline" onClick={onReset}>
            Try Another Resume
          </Button>
        </div>
        
        <div className="flex gap-2 justify-center">
          <FacebookShareButton url={shareUrl} quote={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          
          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          
          <WhatsappShareButton url={shareUrl} title={title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          
          <LinkedinShareButton url={shareUrl} title={title}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  );
}
