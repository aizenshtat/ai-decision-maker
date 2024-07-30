-- Create system user if it doesn't exist
INSERT INTO "User" (id, name, email, password)
VALUES ('system', 'System User', 'system@example.com', 'not_a_real_password')
ON CONFLICT (id) DO NOTHING;

-- Add default framework if it doesn't exist
INSERT INTO "Framework" (id, name, description, steps, "userId", "createdAt", "updatedAt")
VALUES (
  'default',
  'Refined Personal Decision Framework',
  'A structured approach for making significant personal decisions that impact your life, career, relationships, or personal growth.',
  '{"steps": [{"title": "Define the Decision","description": "Clearly state the decision you need to make and its context.","fields": [{"name": "decision_statement","type": "text","label": "Decision Statement","description": "A clear, concise statement of the decision to be made","placeholder": "e.g., Should I change my career from marketing to software development within the next year?"},{"name": "context","type": "textarea","label": "Context","description": "Additional relevant context for the decision","placeholder": "Describe your current situation and why you''re considering this decision."},{"name": "desired_outcome","type": "text","label": "Desired Outcome","description": "A statement of what you hope to achieve","placeholder": "e.g., Find a more fulfilling career with better long-term prospects"}],"ai_instructions": "Provide suggestions for framing the decision and considering its context. Encourage the user to be specific about what they''re deciding, consider the timeframe, and identify any constraints or limitations."}]}',
  'system',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;