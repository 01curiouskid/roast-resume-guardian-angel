
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

    // Extract key resume elements to use in the prompt
    const keyElements = extractResumeElements(resumeText);
    console.log("Extracted resume elements:", keyElements);

    // Format the system prompt based on roast intensity and resume elements
    const intensityLevel = intensity === 'extra-spicy' ? 'brutally funny and harsh' : 'mildly sarcastic';
    const roastLength = intensity === 'extra-spicy' ? '8-10 lines' : '6-8 lines';
    
    const systemPrompt = `You are a corporate hiring manager with a cynical, witty sense of humor. 
    Your job is to 'roast' the resume provided in a ${intensityLevel} way. 
    Be snarky, use corporate satire and meme-like language, and target the specific resume elements I'll provide.
    Make specific references to the skills, job titles, education, and achievements mentioned in the resume.
    Keep it ${roastLength}, punchy, and entertaining.
    Use 4-6 emojis for emphasis throughout the roast.
    Don't explain that you're an AI - stay in character as the roaster.
    IMPORTANT: Do NOT start your response with phrases like "Thanks for the prompt!" or any other introductory text.
    Jump directly into the roast itself. Start with something like, "Okay let's get started..."`;

    // Create user prompt with specific elements to target
    const userPrompt = `Here's the resume to roast:

${resumeText}

Key elements to focus your roast on:
- Job titles/positions: ${keyElements.jobTitles.join(', ')}
- Skills mentioned: ${keyElements.skills.join(', ')}
- Education: ${keyElements.education.join(', ')}
- Achievements/buzzwords: ${keyElements.achievements.join(', ')}

Create a ${roastLength} roast that specifically references these elements while maintaining a ${intensityLevel} tone.`;

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
        model: "google/gemma-3-4b-it:free", // Updated to the new model
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
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

    // Process the response to remove any potential introductory text
    let roastContent = data.choices[0].message.content;
    
    // Try to remove common introductory phrases
    const introPatterns = [
      /^Thanks for the prompt!.*/i,
      /^Here's a roast of .*/i,
      /^I'll create a roast.*/i,
      /^Here is a .*/i,
      /^Alright, let's roast.*/i
    ];
    
    for (const pattern of introPatterns) {
      roastContent = roastContent.replace(pattern, '');
    }
    
    // Trim any leading whitespace or newlines
    roastContent = roastContent.trim();

    return new Response(
      JSON.stringify({ roast: roastContent }),
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

// Function to extract key elements from the resume text
function extractResumeElements(text: string) {
  // Normalize text - convert to lowercase and remove extra spaces
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
  
  // Common job titles to look for
  const commonJobTitles = [
    'manager', 'director', 'assistant', 'coordinator', 'specialist', 'analyst', 
    'developer', 'engineer', 'designer', 'consultant', 'administrator', 'supervisor',
    'intern', 'associate', 'executive', 'ceo', 'cto', 'cfo', 'vp', 'president',
    'lead', 'head of', 'officer', 'representative', 'technician', 'accountant'
  ];
  
  // Common skills to look for
  const commonSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 
    'project management', 'time management', 'detail oriented', 'creative',
    'java', 'python', 'javascript', 'react', 'angular', 'node', 'sql', 'nosql',
    'c++', 'c#', 'php', 'html', 'css', 'aws', 'azure', 'excel', 'powerpoint',
    'word', 'photoshop', 'illustrator', 'figma', 'sketch', 'customer service',
    'sales', 'marketing', 'agile', 'scrum', 'kanban', 'jira', 'confluence',
    'microsoft office', 'public speaking', 'writing', 'research', 'analysis'
  ];
  
  // Common education terms
  const educationTerms = [
    'bachelor', 'master', 'phd', 'doctorate', 'mba', 'associate', 'certificate',
    'certification', 'degree', 'university', 'college', 'school', 'institute',
    'gpa', 'cum laude', 'magna cum laude', 'summa cum laude', 'honors', 'dean'
  ];
  
  // Common achievement/buzzword terms
  const achievementTerms = [
    'achieved', 'increased', 'improved', 'reduced', 'enhanced', 'developed',
    'created', 'implemented', 'managed', 'led', 'coordinated', 'organized',
    'oversaw', 'spearheaded', 'pioneered', 'launched', 'innovative', 'streamlined',
    'optimized', 'efficient', 'strategic', 'synergy', 'leverage', 'scalable',
    'disruption', 'paradigm', 'growth', 'revenue', 'profit', 'success', 'award',
    'recognition', 'honored', 'top performer', 'exceeded', 'outstanding'
  ];
  
  // Find matches in the text
  const jobTitles = findMatches(normalizedText, commonJobTitles);
  const skills = findMatches(normalizedText, commonSkills);
  const education = findMatches(normalizedText, educationTerms);
  const achievements = findMatches(normalizedText, achievementTerms);
  
  // Extract any degrees mentioned (e.g., B.S., M.S., Ph.D.)
  const degreeRegex = /(?:b\.?s\.?|m\.?s\.?|ph\.?d\.?|bachelor'?s?|master'?s?|doctorate|mba)/gi;
  const degreeMatches = text.match(degreeRegex) || [];
  education.push(...degreeMatches.map(d => d.trim()));
  
  // Extract years of experience if mentioned
  const expRegex = /(\d+)(?:\+)?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/gi;
  const expMatches = text.match(expRegex) || [];
  if (expMatches.length > 0) {
    achievements.push(...expMatches.map(e => e.trim()));
  }
  
  return {
    jobTitles: [...new Set(jobTitles)].slice(0, 5),    // Take top 5 unique items
    skills: [...new Set(skills)].slice(0, 8),          // Take top 8 unique items
    education: [...new Set(education)].slice(0, 3),    // Take top 3 unique items
    achievements: [...new Set(achievements)].slice(0, 6) // Take top 6 unique items
  };
}

// Helper function to find matches from a list in text
function findMatches(text: string, terms: string[]) {
  return terms.filter(term => text.includes(term.toLowerCase()));
}
