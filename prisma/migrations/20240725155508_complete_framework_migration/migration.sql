-- Create system user if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "User" WHERE id = 'system') THEN
        INSERT INTO "User" (id, name, email, password)
        VALUES ('system', 'System User', 'system@example.com', 'not_a_real_password');
    END IF;
END $$;

-- Check if frameworkId column exists in Decision table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Decision' AND column_name='frameworkId') THEN
        ALTER TABLE "Decision" ADD COLUMN "frameworkId" TEXT;
    END IF;
END $$;

-- Check if steps column exists in Decision table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Decision' AND column_name='steps') THEN
        ALTER TABLE "Decision" ADD COLUMN "steps" JSONB;
        UPDATE "Decision" SET "steps" = '[]'::jsonb WHERE "steps" IS NULL;
        ALTER TABLE "Decision" ALTER COLUMN "steps" SET NOT NULL;
    END IF;
END $$;

-- Check if CustomFramework table exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'CustomFramework') THEN
        CREATE TABLE "CustomFramework" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "steps" JSONB NOT NULL,
            "userId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "CustomFramework_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- Add foreign keys if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Decision_frameworkId_fkey') THEN
        ALTER TABLE "Decision" ADD CONSTRAINT "Decision_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "CustomFramework"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'CustomFramework_userId_fkey') THEN
        ALTER TABLE "CustomFramework" ADD CONSTRAINT "CustomFramework_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Add default framework if it doesn't exist
INSERT INTO "CustomFramework" (id, name, description, steps, "userId", "createdAt", "updatedAt")
VALUES (
  'default',
  'Refined Personal Decision Framework',
  'A structured approach for making significant personal decisions that impact your life, career, relationships, or personal growth.',
  '{"steps": []}',
  (SELECT id FROM "User" WHERE id = 'system'),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Update the steps field with the actual framework steps
UPDATE "CustomFramework"
SET steps = '{"steps": [{"title": "Define the Decision","description": "Clearly state the decision you need to make and its context.","fields": [{"name": "decision_statement","type": "text","label": "Decision Statement","description": "A clear, concise statement of the decision to be made","placeholder": "e.g., Should I change my career from marketing to software development within the next year?"},{"name": "context","type": "textarea","label": "Context","description": "Additional relevant context for the decision","placeholder": "Describe your current situation and why you''re considering this decision."},{"name": "desired_outcome","type": "text","label": "Desired Outcome","description": "A statement of what you hope to achieve","placeholder": "e.g., Find a more fulfilling career with better long-term prospects"}],"ai_instructions": "Provide suggestions for framing the decision and considering its context. Encourage the user to be specific about what they''re deciding, consider the timeframe, and identify any constraints or limitations."}]}'::jsonb
WHERE id = 'default';