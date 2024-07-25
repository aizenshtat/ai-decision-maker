// src/services/aiSuggestionService.ts

import { PERSONAL_DECISION_FRAMEWORK } from '@/lib/decisionFramework';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PROMPT_TEMPLATE = `
Step: {step_title}

{step_description}

Current Decision Context:
{current_context}

Please provide guidance for the user on this step of their decision-making process. 
Consider the following fields that the user needs to complete:

{fields}

Based on the user's input so far and the requirements of this step, provide:
1. A brief explanation and suggestions for this step (in markdown format) Important: always use \\n for new lines.
2. Pre-filled data for the user input fields, based on your best guess of what user would write

Please ensure that your pre-filled data adheres to the field types, structures, and validations described above.

Please structure your response in the following JSON format:

{
    "suggestion": "Your brief markdown-formatted suggestion here",
    "pre_filled_data": {
        {field_format}
    }
}
`;

function generateFieldFormat(fields: any[]): string {
  const formats = fields.map(field => {
    switch (field.type) {
      case 'matrix':
        return `"${field.name}": {"Option1": {"Criterion1": 5, "Criterion2": 4}, "Option2": {"Criterion1": 3, "Criterion2": 5}}`;
      case 'list_of_objects':
        const objectFormat = Object.keys(field.object_structure).map(k => `"${k}": "Example ${k}"`).join(", ");
        return `"${field.name}": [{${objectFormat}}, {${objectFormat}}]`;
      case 'list':
        return `"${field.name}": ["Example 1", "Example 2", "Example 3"]`;
      default:
        return `"${field.name}": "Example ${field.name}"`;
    }
  });
  return formats.join(",\n        ");
}

function generateFieldDescription(field: any): string {
  let description = `- ${field.label}: ${field.description}\n`;
  description += `  Type: ${field.type}\n`;

  if (field.type === 'matrix') {
    description += `  Matrix Structure:\n`;
    description += `    Rows: ${field.matrix_structure.rows}\n`;
    description += `    Columns: ${field.matrix_structure.columns}\n`;
    if (field.cell_format) {
      description += `  Cell Format: ${JSON.stringify(field.cell_format)}\n`;
    }
  } else if (field.type === 'list_of_objects') {
    description += `  Object Structure: ${JSON.stringify(field.object_structure)}\n`;
  }

  if (field.validation) {
    description += `  Validation: ${JSON.stringify(field.validation)}\n`;
  }

  if (field.dependencies) {
    description += `  Dependencies: ${JSON.stringify(field.dependencies)}\n`;
  }

  return description;
}

export async function getAiSuggestion(stepIndex: number, currentContext: any): Promise<any> {
  const step = PERSONAL_DECISION_FRAMEWORK.steps[stepIndex];
  const fieldsText = step.fields.map(generateFieldDescription).join("\n");
  const fieldFormat = generateFieldFormat(step.fields);

  const formattedContext = Object.entries(currentContext)
    .map(([key, value]) => `${key}:\n${JSON.stringify(value, null, 2)}`)
    .join("\n");

  const prompt = PROMPT_TEMPLATE
    .replace('{step_title}', step.title)
    .replace('{step_description}', step.description)
    .replace('{current_context}', formattedContext)
    .replace('{fields}', fieldsText)
    .replace('{field_format}', fieldFormat);

  console.log('Generated AI prompt:', prompt);

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt}]
    });

    const aiResponse = response.content[0].text;
    console.log('AI response:', aiResponse);

    if (!aiResponse) {
      throw new Error('Empty response from AI');
    }

    // Attempt to parse the JSON response
    try {
      const parsedResponse = JSON.parse(aiResponse);
      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // If parsing fails, return a structured error response
      return {
        suggestion: "Sorry, I couldn't generate a proper suggestion at this time.",
        pre_filled_data: {}
      };
    }
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    // Return a structured error response
    return {
      suggestion: "An error occurred while generating the AI suggestion.",
      pre_filled_data: {}
    };
  }
}