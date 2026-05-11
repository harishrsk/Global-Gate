import { getCorridors } from '@/actions/corridor';
import { CorridorClient } from '@/components/CorridorClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Trade Corridors | Global-Gate",
  description: "Manage global trade routes and multi-sector import/export corridors.",
};

export default async function CorridorsPage() {
  const corridors = await getCorridors();

  return (
    <div className="space-y-8">
      <CorridorClient initialCorridors={corridors} />
    </div>
  );
}
