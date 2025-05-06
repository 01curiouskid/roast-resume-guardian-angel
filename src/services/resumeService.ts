
import { supabase } from "@/integrations/supabase/client";

export async function getRoast(resumeText: string, intensity: 'spicy' | 'extra-spicy'): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('roast-resume', {
      body: {
        resumeText,
        intensity
      }
    });

    if (error) {
      console.error('Error calling roast-resume function:', error);
      throw new Error('Failed to generate roast. Please try again.');
    }

    if (!data?.roast) {
      throw new Error('Failed to generate roast. Empty response received.');
    }

    return data.roast;
    
  } catch (error) {
    console.error('Error in getRoast:', error);
    throw error;
  }
}
