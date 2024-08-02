// src/components/FrameworkEditor.tsx
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Framework, Step } from '@/types/framework';

interface FrameworkEditorProps {
  framework: Framework;
  onSave: (framework: Framework) => void;
}

const FrameworkEditor: React.FC<FrameworkEditorProps> = ({ framework, onSave }) => {
  const [name, setName] = useState(framework.name);
  const [description, setDescription] = useState(framework.description || '');
  const [steps, setSteps] = useState<Step[]>(framework.steps);

  const handleAddStep = () => {
    setSteps([...steps, { title: '', description: '', fields: [] }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: keyof Step, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleSave = () => {
    onSave({ ...framework, name, description, steps });
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Framework</h2>
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">Steps</h3>
      {steps.map((step, index) => (
        <Card key={index} className="mb-4 p-4">
          <Input
            label={`Step ${index + 1} Title`}
            value={step.title}
            onChange={(e) => handleStepChange(index, 'title', e.target.value)}
            className="mb-2"
          />
          <Textarea
            label="Description"
            value={step.description}
            onChange={(e) => handleStepChange(index, 'description', e.target.value)}
            className="mb-2"
          />
          <Button onClick={() => handleRemoveStep(index)} variant="secondary">
            Remove Step
          </Button>
        </Card>
      ))}
      <Button onClick={handleAddStep} className="mb-4">
        Add Step
      </Button>
      <Button onClick={handleSave}>Save Framework</Button>
    </Card>
  );
};

export default FrameworkEditor;