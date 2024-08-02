// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Decision } from '@/types/decision';
import { authenticatedFetch } from '@/utils/api';
import BarChart from '@/components/BarChart';
import Feedback from '@/components/Feedback';
import { FileText, ArrowRight, CheckCircle } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

const Dashboard: React.FC = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const response = await authenticatedFetch('/api/decisions');
        if (response) {
          const data = await response.json();
          setDecisions(data);
        }
      } catch (error) {
        console.error('Error fetching decisions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDecisions();
  }, []);

  const completedDecisions = decisions.filter(d => d.status === 'completed');
  const inProgressDecisions = decisions.filter(d => d.status === 'in_progress');

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Decision Statistics</h2>
            <BarChart
              labels={['Completed', 'In Progress']}
              data={[completedDecisions.length, inProgressDecisions.length]}
              title="Decision Status"
              color="rgba(75, 192, 192, 0.6)"
            />
          </Card>
          <Card>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link href="/decisions/new">
                <Button className="w-full">Start New Decision</Button>
              </Link>
              <Link href="/frameworks">
                <Button variant="secondary" className="w-full">Manage Frameworks</Button>
              </Link>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold mb-4">Progress Tracker</h2>
            <div className="space-y-2">
              {inProgressDecisions.slice(0, 3).map(decision => (
                <div key={decision.id} className="flex items-center justify-between">
                  <span className="text-sm truncate">{decision.question}</span>
                  <span className="text-xs text-gray-500">
                    Step {decision.currentStep + 1}/{decision.framework.steps.length}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Recent Decisions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decisions.length === 0 ? (
            <p>No decisions found. Start a new one!</p>
          ) : (
            decisions.slice(0, 6).map(decision => (
              <DecisionCard key={decision.id} decision={decision} />
            ))
          )}
        </div>
        <Feedback />
      </div>
    </ErrorBoundary>
  );
};

const DecisionCard: React.FC<{ decision: Decision }> = ({ decision }) => (
  <Card className="transition-all hover:shadow-lg">
    <div className="flex items-center mb-2">
      <FileText className="h-5 w-5 mr-2 text-primary-500" />
      <h3 className="text-lg font-semibold truncate">{decision.question}</h3>
    </div>
    <p className="text-sm text-gray-600 mb-4">Framework: {decision.framework.name}</p>
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm">
        Status: 
        <span className={decision.status === 'completed' ? 'text-green-500 ml-1' : 'text-yellow-500 ml-1'}>
          {decision.status === 'completed' ? 'Completed' : 'In Progress'}
        </span>
      </span>
      {decision.status === 'in_progress' && (
        <span className="text-xs text-gray-500">
          Step {decision.currentStep + 1}/{decision.framework.steps.length}
        </span>
      )}
    </div>
    <Link href={`/decisions/${decision.id}/${decision.status === 'completed' ? 'summary' : `steps/${decision.currentStep}`}`}>
      <Button variant="outline" className="w-full">
        {decision.status === 'completed' ? (
          <>
            View Summary
            <CheckCircle className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </Link>
  </Card>
);

export default Dashboard;