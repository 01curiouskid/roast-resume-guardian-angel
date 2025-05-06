
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, intensity } = await req.json();
    
    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format the system prompt based on roast intensity
    const intensityLevel = intensity === 'extra-spicy' ? 'brutally funny and harsh' : 'mildly sarcastic';
    
    const systemPrompt = `You are a corporate hiring manager with a cynical, witty sense of humor. 
    Your job is to 'roast' the resume provided in a ${intensityLevel} way. 
    Be snarky, use corporate satire and meme-like language, and target obvious resume flaws or clichés. 
    Keep it short (250 words max), punchy, and entertaining. 
    Use 3-5 emojis for emphasis. 
    Don't explain that you're an AI - stay in character as the roaster.`;

    // Call OpenRouter API with the secret key
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENROUTER_API_KEY")}`,
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "RoastMyResume"
      },
      body: JSON.stringify({
        model: "google/gemma-3-1b-it:free",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Here's my resume content. Roast it please:\n\n${resumeText}`
          }
        ],
        temperature: 0.8,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    console.log("OpenRouter API response:", JSON.stringify(data));

    if (!data.choices || data.choices.length === 0) {
      console.error("Invalid API response:", data);
      return new Response(
        JSON.stringify({ error: "Failed to generate roast", details: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ roast: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in roast-resume function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
