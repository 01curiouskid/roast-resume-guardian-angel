
import { Label } from "@/components/ui/label";

interface IntensityToggleProps {
  intensity: 'spicy' | 'extra-spicy';
  setIntensity: (intensity: 'spicy' | 'extra-spicy') => void;
}

export function IntensityToggle({ intensity, setIntensity }: IntensityToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <Label htmlFor="intensity-toggle" className="text-white">Roast Intensity:</Label>
      
      <div className="flex bg-gray-800 rounded-lg p-1">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            intensity === 'spicy' 
              ? 'bg-purple-600 text-white' 
              : 'text-purple-300 hover:text-white'
          }`}
          onClick={() => setIntensity('spicy')}
        >
          Spicy 🔥
        </button>
        
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            intensity === 'extra-spicy' 
              ? 'bg-purple-600 text-white' 
              : 'text-purple-300 hover:text-white'
          }`}
          onClick={() => setIntensity('extra-spicy')}
        >
          Extra Spicy 🔥🔥🔥
        </button>
      </div>
    </div>
  );
}
