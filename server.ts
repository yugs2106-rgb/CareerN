import express from 'express';
import path from 'path';
import multer from 'multer';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Health check endpoint for container ingress
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Lazy initialize Gemini API client to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('GEMINI_API_KEY environment variable is not configured. Falling back to local heuristic mode.');
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// 1. CV -> Profile Extraction
app.post('/api/extract-cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CV uploaded' });
    }

    const ai = getAI();
    if (!ai) {
      // Fallback extracted mock structure if no API key is set
      return res.json({
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'],
        branch: 'Computer Science & Engineering',
        degree: 'B.Tech',
        batch: '2026',
        cgpa: '8.5',
        aboutMe: 'Passionate software engineering student with experience in full-stack web applications and data systems.'
      });
    }

    const fileBase64 = req.file.buffer.toString('base64');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: fileBase64,
                mimeType: req.file.mimetype || 'application/pdf'
              }
            },
            {
              text: `Extract student profile fields from this resume. Return only valid JSON.
Fields:
- phone (string)
- branch (string)
- degree (string)
- batch (string)
- linkedin (string url)
- github (string url)
- aboutMe (string summary)
- skills (array of strings)
- languages (array of strings)
- workExperience (string summary)
- projects (string summary)
- certifications (string)
- achievements (string)
- cgpa (string)`
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error extracting CV:', error);
    res.status(500).json({ error: error.message || 'Failed to extract CV' });
  }
});

// 2. Internship Matching
app.post('/api/match-internship', async (req, res) => {
  try {
    const { studentProfile, internship } = req.body;
    
    const ai = getAI();
    if (!ai) {
      // Heuristic fallback matching
      const studentSkills: string[] = studentProfile?.skills || [];
      const requiredSkills: string[] = internship?.requiredSkills || [];
      const matched = requiredSkills.filter(r => 
        studentSkills.some(s => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
      );
      const ratio = requiredSkills.length > 0 ? matched.length / requiredSkills.length : 0.75;
      const score = Math.round(55 + (ratio * 40));
      return res.json({
        score: Math.min(score, 98),
        explanation: `Candidate possesses strong background in ${matched.slice(0, 2).join(', ') || 'required domain areas'} with eligible academic criteria.`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Evaluate the match between this student and the internship.
      
Student Profile:
${JSON.stringify(studentProfile, null, 2)}

Internship Details:
${JSON.stringify(internship, null, 2)}

Return a JSON object with:
1. score (number from 1 to 100) representing fit.
2. explanation (string) a concise 2-sentence explanation of why they are a good match.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["score", "explanation"]
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error matching internship:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Career Gap Analysis
app.post('/api/career-gap', async (req, res) => {
  try {
    const { studentProfile, targetRole } = req.body;
    
    const ai = getAI();
    if (!ai) {
      return res.json({
        missingSkills: ['System Design & Microservices', 'CI/CD Pipelines (GitHub Actions)', 'Production Cloud Deployment (Docker/GCP)'],
        recommendations: [
          'Complete a hands-on project deploying a containerized API with automated unit and integration tests.',
          'Review database indexing and query optimization techniques for scalable high-concurrency systems.'
        ]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Analyze the career gap for this student aiming for the role of "${targetRole}".
      
Student Profile:
${JSON.stringify(studentProfile, null, 2)}

Identify missing skills and actionable recommendations. Return a JSON object with:
1. missingSkills (array of strings)
2. recommendations (array of strings)`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["missingSkills", "recommendations"]
        }
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error analyzing career gap:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. AI Career Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, studentProfile, context } = req.body;
    
    const ai = getAI();
    if (!ai) {
      return res.json({
        reply: "Hello! I'm your CareerNexus AI Advisor. You can ask me about resume preparation, eligible campus drives, interview tips, or how to align your project portfolio with visiting employer expectations."
      });
    }

    const systemInstruction = `You are the CareerNexus AI Placement Advisor. 
You assist university students with campus placement preparation, internship opportunities, and profile enhancement.

Student Profile:
${JSON.stringify(studentProfile, null, 2)}

Available Context (Internships/Events):
${JSON.stringify(context, null, 2)}

Keep responses concise, professional, encouraging, and actionable. Refer to actual context when relevant.`;

    const chatMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: chatMessages,
      config: {
        systemInstruction,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server and Vite middleware
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
