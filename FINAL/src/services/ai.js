import { GoogleGenAI } from '@google/genai';

// We initialize the client if the API key is present
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let aiClient = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey: apiKey });
}

export async function enhanceProductDescription(rawText) {
  if (!aiClient) {
    throw new Error("VITE_GEMINI_API_KEY is not set in your .env file.");
  }

  const prompt = `
You are an expert technical writer and UI designer. 
I am going to give you raw, unformatted text containing product specifications and features.
Your job is to format this text into beautiful, structured HTML that will be injected into a React application using dangerouslySetInnerHTML.

RULES:
1. ONLY output raw HTML. Do not use Markdown code blocks (like \`\`\`html). Output the string directly.
2. Use Tailwind CSS utility classes heavily to make the output look extremely premium and professional.
3. For tabular data (like specifications), create a clean HTML <table>. Use classes like 'w-full text-left border-collapse', 'border-b border-gray-200', 'p-4', 'bg-gray-50' for headers, and 'text-sm text-gray-700' for table cells. Striped rows are nice ('even:bg-gray-50').
4. For features, use structured lists <ul> or grid layouts (e.g., <div class="grid grid-cols-1 md:grid-cols-2 gap-6">) with icons or bold titles if appropriate.
5. Emphasize key text using bold <span class="font-bold text-brand-obsidian"> tags.
6. Do not include a full HTML document (no <html>, <head>, or <body>). Just output the inner HTML content.
7. Wrap sections in clear spacing, e.g., <div class="mb-8">.
8. If there are distinct sections (e.g., "Features" vs "Specifications"), add clear headings like <h3 class="text-xl font-bold font-serif mb-4 text-[#0A2540]">Specifications</h3>.

RAW TEXT:
${rawText}
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let html = response.text;
    // Strip markdown code blocks if the model still outputs them despite instructions
    if (html.startsWith('\`\`\`html')) {
      html = html.replace(/^\`\`\`html\\n?/, '').replace(/\\n?\`\`\`$/, '');
    } else if (html.startsWith('\`\`\`')) {
      html = html.replace(/^\`\`\`\\n?/, '').replace(/\\n?\`\`\`$/, '');
    }
    
    return html.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to enhance description. Check console for details.");
  }
}
