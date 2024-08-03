'use client'

import React, { useState, useEffect } from 'react';
import DecisionCard from '@/components/DecisionCard';
import { Decision } from '@/types/decision';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { authenticatedFetch } from '@/utils/api';

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDecisions() {
      try {
        const response = await authenticatedFetch('/api/decisions');
        if (response) {
          const data = await response.json();
          setDecisions(data);
        }
      } catch (err) {
        setError('Failed to fetch decisions');
      } finally {
        setIsLoading(false);
      }
    }
    fetchDecisions();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Decisions</h1>
      <Link href="/decisions/new">
        <Button className="mb-6">Start New Decision</Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decisions.map(decision => (
          <DecisionCard key={decision.id} decision={decision} />
        ))}
      </div>
    </div>
  );
}