import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    // There is no direct listModels in the SDK for easy use without the management API
    // But we can try to initialize 1.5 Flash and see if it works
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Model initialized: gemini-1.5-flash');
  } catch (e) {
    console.error('Failed to initialize gemini-1.5-flash', e);
  }
}

listModels();
