import React, { useState, useEffect } from 'react';
import { Decision } from '@/types/decision';
import { Framework } from '@/types/framework';
import { authenticatedFetch } from '@/utils/api';
import Skeleton from '@/components/ui/Skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import DecisionCard from '@/components/DecisionCard';
import DashboardCharts from './DashboardCharts';
import QuickActions from './QuickActions';
import ProgressTracker from './ProgressTracker';
import Feedback from '@/components/Feedback';

const Dashboard: React.FC = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [decisionsResponse, frameworksResponse] = await Promise.all([
          authenticatedFetch('/api/decisions'),
          authenticatedFetch('/api/frameworks')
        ]);
        
        if (decisionsResponse && frameworksResponse) {
          const decisionsData = await decisionsResponse.json();
          const frameworksData = await frameworksResponse.json();
          setDecisions(decisionsData);
          setFrameworks(frameworksData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteDecision = async (id: string) => {
    try {
      await authenticatedFetch(`/api/decisions/${id}`, { method: 'DELETE' });
      setDecisions(decisions.filter(decision => decision.id !== id));
    } catch (error) {
      console.error('Error deleting decision:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <DashboardCharts decisions={decisions} frameworks={frameworks} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuickActions />
          <ProgressTracker decisions={decisions} />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Recent Decisions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {decisions.length === 0 ? (
            <p>No decisions found. Start a new one!</p>
          ) : (
            decisions.slice(0, 6).map(decision => (
              <DecisionCard key={decision.id} decision={decision} onDelete={handleDeleteDecision} />
            ))
          )}
        </div>
        <Feedback />
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;