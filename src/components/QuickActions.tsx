import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const QuickActions: React.FC = () => {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        <Link href="/decisions/new" className="block mb-4">
          <Button className="w-full">Start New Decision</Button>
        </Link>
        <Link href="/frameworks" className="block">
          <Button variant="secondary" className="w-full">Manage Frameworks</Button>
        </Link>
      </div>
    </Card>
  );
};

export default QuickActions;