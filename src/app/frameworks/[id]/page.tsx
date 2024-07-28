import React from 'react';
import FrameworkDetails from '@/components/FrameworkDetails';

export default function FrameworkPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <FrameworkDetails id={params.id} />
    </div>
  );
}