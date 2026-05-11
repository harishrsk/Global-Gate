import { VisionScanner } from '@/components/VisionScanner';
import { Camera } from 'lucide-react';
import { getCorridors } from '@/actions/corridor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Vision Lab | Global-Gate",
  description: "Multimodal AI product grading and trade compliance analysis.",
};

export default async function AnalyzePage() {
  const corridors = await getCorridors();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
          <Camera size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Vision Lab</h2>
          <p className="text-slate-500">Upload a product photo to get instant grading, documentation requirements, and market demand insights.</p>
        </div>
      </div>

      <VisionScanner initialCorridors={corridors} />
    </div>
  );
}
