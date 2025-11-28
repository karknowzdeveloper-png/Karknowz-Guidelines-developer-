import { GoogleGenAI, Type } from "@google/genai";
import { AppListing, OptimizationResult, AuditIssue } from "../types";

// Initialize Gemini Client
// NOTE: We assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates optimized metadata (Title, Short Desc, Long Desc) based on input.
 * Uses gemini-3-pro-preview for high-quality reasoning and creative writing.
 */
export const generateListingMetadata = async (
  currentName: string,
  keywords: string,
  tone: string
): Promise<OptimizationResult> => {
  const model = "gemini-3-pro-preview";

  const prompt = `
    You are an expert App Store Optimization (ASO) specialist.
    Create a Google Play Store listing for an app with the following details:
    - App Name/Idea: ${currentName}
    - Keywords: ${keywords}
    - Desired Tone: ${tone}

    Constraints:
    - Title: Max 30 characters. Catchy and includes main keyword if possible.
    - Short Description: Max 80 characters. Hook the user immediately.
    - Full Description: Max 4000 characters. Structured with headers, clear value props, and features. Markdown format allowed.

    Return the response in structured JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Optimized App Title (max 30 chars)" },
            shortDescription: { type: Type.STRING, description: "Optimized Short Description (max 80 chars)" },
            fullDescription: { type: Type.STRING, description: "Full Store Description" },
            reasoning: { type: Type.STRING, description: "Brief explanation of why these choices were made" }
          },
          required: ["title", "shortDescription", "fullDescription", "reasoning"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OptimizationResult;
    }
    throw new Error("No text returned from Gemini");
  } catch (error) {
    console.error("Metadata generation failed:", error);
    throw error;
  }
};

/**
 * Generates an app icon concept.
 * Uses gemini-2.5-flash-image for fast image generation.
 */
export const generateAppIcon = async (
  description: string,
  style: string
): Promise<string> => {
  const model = "gemini-2.5-flash-image";
  
  const prompt = `
    Design a mobile app icon.
    Subject: ${description}
    Style: ${style}
    
    Requirements:
    - High contrast, clearly visible at small sizes.
    - Square aspect ratio (1:1).
    - No text inside the icon.
    - Professional, polished vector art style.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        // No responseSchema/MimeType for image generation on this model usually, 
        // but we just want the inlineData in the response parts.
      }
    });

    // Iterate to find the image part
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Icon generation failed:", error);
    throw error;
  }
};

/**
 * Audits the current listing for policy violations and improvements.
 * Uses gemini-2.5-flash for speed.
 */
export const auditListing = async (listing: AppListing): Promise<AuditIssue[]> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Audit this Google Play Store listing for policy violations and ASO improvements.
    
    Listing Data:
    - Title: "${listing.appName}"
    - Short Description: "${listing.shortDescription}"
    - Full Description: "${listing.fullDescription}"
    - Keywords: ${listing.keywords.join(', ')}

    Rules:
    - Title limit: 30 chars.
    - Short Desc limit: 80 chars.
    - No keyword stuffing.
    - No misleading claims (e.g. "Best", "#1", "No Ads" if not true).
    - Clarity and grammar check.

    Return a JSON list of issues.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
              field: { type: Type.STRING, enum: ["title", "shortDescription", "fullDescription", "general"] },
              message: { type: Type.STRING },
              suggestion: { type: Type.STRING }
            },
            required: ["severity", "field", "message", "suggestion"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AuditIssue[];
    }
    return [];
  } catch (error) {
    console.error("Audit failed:", error);
    throw error;
  }
};
