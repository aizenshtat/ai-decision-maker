# AI Decision Maker

## Project Overview

AI Decision Maker is a sophisticated web application designed to assist users in making complex decisions by leveraging artificial intelligence. The application guides users through a structured decision-making process, providing AI-generated suggestions and insights at each step.

## Key Features

1. User Authentication
   - Secure login and registration system
   - JWT-based authentication using NextAuth.js

2. Decision Frameworks
   - Pre-defined default framework for personal decisions
   - Ability to create, edit, and clone custom decision frameworks

3. Decision-Making Process
   - Step-by-step guided process based on the selected framework
   - AI-generated suggestions for each step
   - Dynamic form fields based on framework configuration

4. Data Visualization
   - Matrix-based evaluation of options against criteria
   - List and object-based data entry for various decision aspects

5. AI Integration
   - Utilizes Anthropic's Claude AI model for generating suggestions
   - Context-aware AI responses based on user inputs

6. Decision Management
   - Dashboard for viewing and managing ongoing and completed decisions
   - Ability to continue in-progress decisions

7. Feedback System
   - User feedback collection for completed decisions
   - Rating and comment functionality

8. Responsive Design
   - Mobile-friendly interface using Tailwind CSS

## Technical Stack

- Frontend: React, Next.js
- Backend: Next.js API routes
- Database: PostgreSQL with Prisma ORM
- Authentication: NextAuth.js
- AI Integration: Anthropic Claude API
- Styling: Tailwind CSS
- State Management: React Hooks

## Project Structure

- `/src/app`: Next.js app router structure
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and Prisma client
- `/src/services`: AI suggestion service
- `/src/types`: TypeScript type definitions
- `/prisma`: Database schema and migrations

## Key Processes and Data Flow

1. User Authentication:
   - Users register or log in through the NextAuth.js system
   - JWT tokens are used for maintaining sessions

2. Framework Selection:
   - Users choose a decision framework or create a custom one
   - Framework data is stored in the PostgreSQL database

3. Decision Creation:
   - User initiates a new decision, selecting a framework
   - A new decision record is created in the database

4. Step-by-Step Process:
   - The application guides the user through each step defined in the framework
   - At each step:
     a. The frontend fetches step data and any previously saved inputs
     b. The AI suggestion service generates context-aware suggestions
     c. User inputs are collected and stored in the database

5. AI Suggestion Generation:
   - The application sends the current context to the Anthropic Claude API
   - The API returns suggestions and pre-filled data based on the context
   - Suggestions are displayed to the user and stored for future reference

6. Data Visualization and Input:
   - Complex data structures (matrices, lists of objects) are rendered as interactive forms
   - User inputs are validated and stored in real-time

7. Decision Completion:
   - Once all steps are completed, a summary is generated using the AI
   - The decision status is updated to 'completed' in the database

8. Feedback Collection:
   - Users can provide ratings and comments on completed decisions
   - Feedback is stored in the database for potential future improvements

## Database Schema

The PostgreSQL database includes tables for:
- Users
- Decisions
- Frameworks
- Feedback

Relationships are maintained using foreign keys, allowing for efficient querying and data integrity.

## AI Integration Details

The project uses the Anthropic Claude API for generating AI suggestions. The integration works as follows:

1. A custom prompt template is defined in `src/services/aiSuggestionService.ts`
2. The template is populated with context from the current decision step
3. The filled template is sent to the Claude API
4. The API response is parsed and formatted for display to the user

## Security Measures

- Passwords are hashed using bcrypt before storage
- API routes are protected with NextAuth.js middleware
- Environment variables are used for storing sensitive information

## Deployment

The application is designed to be deployed on Vercel, leveraging its seamless integration with Next.js projects.

## Future Enhancements

Ranked by priority (considering both user value and complexity):

1. AI Chat Integration (Complexity: 3/5, User Value: 5/5)
   - Implement a side window for direct conversation with AI
   - Generate input suggestions based on the chat conversation
   - Add a button to transfer AI suggestions to input fields

2. Personalized Decision Suggestions (Complexity: 4/5, User Value: 5/5)
   - Tailor AI suggestions based on user profile information
   - Automatically update user profiles with insights from decisions
   - Use AI to summarize personality traits, life situations, and potential behavioral patterns

3. Mobile Application (Complexity: 4/5, User Value: 5/5)
   - Develop native mobile apps for iOS and Android
   - Implement push notifications for decision reminders and updates

4. Decision Outcome Tracking (Complexity: 2/5, User Value: 4/5)
   - Allow users to log the actual outcomes of their decisions
   - Provide analysis of decision quality over time

5. Time-Based Decision Making (Complexity: 2/5, User Value: 4/5)
   - Implement features for time-sensitive decisions (e.g., countdowns, deadlines)
   - Provide scheduling assistance for implementing decision action plans
   - Add reminders and notifications to combat procrastination

6. Enhanced Data Visualization and Reporting (Complexity: 3/5, User Value: 4/5)
   - Implement interactive charts and graphs for decision analysis
   - Provide downloadable reports of decision processes and outcomes

7. Integration with External Data Sources (Complexity: 3/5, User Value: 4/5)
    - Connect to APIs for real-time data relevant to decisions (e.g., financial data, weather, news)
    - Allow users to import data from personal sources (e.g., calendars, fitness trackers)

8. Collaborative Decision-Making (Complexity: 4/5, User Value: 4/5)
   - Enable shared decision processes for teams or groups
   - Implement real-time collaboration features

9. Integration with Additional AI Models (Complexity: 2/5, User Value: 3/5)
    - Incorporate multiple AI models for comparison and diverse perspectives
    - Allow users to choose preferred AI models for suggestions

10. AI-Powered Decision Templates (Complexity: 4/5, User Value: 3/5)
   - Use AI to generate custom decision templates based on user input
   - Allow community sharing of anonymized decision templates

11. Gamification Elements (Complexity: 2/5, User Value: 2/5)
    - Introduce points, badges, or levels for completing decisions
    - Create challenges or quests to encourage regular use of the app

12. Voice Interface (Complexity: 3/5, User Value: 2/5)
    - Implement voice commands for navigating the decision process
    - Provide audio summaries of decision steps and AI suggestions