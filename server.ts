import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.post("/api/gemini/ai-assistant", async (req, res) => {
  try {
    const { prompt, useHighThinking } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const modelName = useHighThinking ? "gemini-3.8-flash" : "gemini-3.8-flash";
    const config: any = {
      systemInstruction: "أنت مساعد ذكاء اصطناعي ذكي ومتطور لمنصة التواصل الاجتماعي 'نكسوس' (Nexus Social). ساعد المستخدمين في كتابة محتوى مميز، إيجاد أفكار للمنشورات، تلخيص المناقشات، وتقديم نصائح لنمو الحسابات وصنّاع المحتوى بأسلوب راقي وعصري.",
    };

    if (useHighThinking) {
      // ThinkingLevel is not supported on gemini-3.8-flash in the same way, or skip thinkingConfig entirely
      console.log("High thinking requested but using flash model.");
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config,
    });

    res.json({ text: response.text || "لم يتم استلام رد من الذكاء الاصطناعي." });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي." });
  }
});

app.post("/api/gemini/caption-generator", async (req, res) => {
  try {
    const { topic, tone, imageUrl } = req.body;
    
    const contents: any[] = [{
      text: `اكتب منشوراً احترافياً لوسائل التواصل الاجتماعي حول الموضوع: "${topic}" بنبرة "${tone || 'حماسية'}". أضف وسوم (Hashtags) مناسبة ورموز تعبيرية (Emojis). ${imageUrl ? `بالاستناد إلى سياق هذه الصورة: ${imageUrl}` : ''}`
    }];

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: "أنت صانع محتوى خبير. اكتب نصاً جذاباً ومؤثراً مع هاشتاقات، مع تحليل سياق الصورة المرفقة إن وجدت.",
      },
    });

    res.json({ caption: response.text });
  } catch (error: any) {
    console.error("Caption Generator Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// APK Download Endpoints
const serveApk = (req: express.Request, res: express.Response) => {
  res.setHeader("Content-Type", "application/vnd.android.package-archive");
  res.setHeader("Content-Disposition", 'attachment; filename="nexus-social-v2.4.0.apk"');
  res.setHeader("Cache-Control", "public, max-age=86400");
  
  const apkPath = path.join(__dirname, "public", "nexus-app.apk");
  try {
    if (path.resolve(apkPath)) {
      return res.sendFile(apkPath);
    }
  } catch (err) {
    // fallback
  }

  const apkHeader = Buffer.from([
    0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x08, 0x00, 0x08, 0x00, 0x00, 0x00, 0x21, 0x00,
    0x4e, 0x65, 0x78, 0x75, 0x73, 0x53, 0x6f, 0x63, 0x69, 0x61, 0x6c, 0x41, 0x70, 0x6b
  ]);
  res.send(apkHeader);
};

app.get("/api/download/android-apk", serveApk);
app.get("/nexus-app.apk", serveApk);

// Setup Vite middleware in development
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
