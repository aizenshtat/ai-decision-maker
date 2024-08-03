import React from 'react';
import Card from '@/components/ui/Card';
import BarChart from '@/components/BarChart';
import PieChart from '@/components/PieChart';
import { Decision } from '@/types/decision';
import { Framework } from '@/types/framework';


interface DashboardChartsProps {
  decisions: Decision[];
  frameworks: Framework[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ decisions, frameworks }) => {
  const completedDecisions = decisions.filter(d => d.status === 'completed');
  const inProgressDecisions = decisions.filter(d => d.status === 'in_progress');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Decision Status</h2>
        <BarChart
          labels={['Completed', 'In Progress']}
          data={[completedDecisions.length, inProgressDecisions.length]}
          title="Decision Status"
        />
      </Card>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Frameworks Used</h2>
        <PieChart
          labels={frameworks.map(f => f.name)}
          data={frameworks.map(f => decisions.filter(d => d.frameworkId === f.id).length)}
          title="Frameworks Used"
        />
      </Card>
    </div>
  );
};

export default DashboardCharts;