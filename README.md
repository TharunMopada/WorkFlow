AI Workflow Builder
A visual workflow builder for AI-powered automation. Build, configure, and chat with custom AI workflows using drag-and-drop components.
Features
Visual Workflow Builder: Drag and drop components (User Query, LLM, Knowledge Base, Output) to create custom AI workflows.
Chat Interface: Interact with your workflow using a chat modal.
Document Upload: Add documents to the knowledge base for context-aware answers.
Pluggable LLM: Integrate with OpenAI (or use mock responses if no API key is provided).
Modern UI: Built with React, TypeScript, Tailwind CSS, and React Flow.
Getting Started
Prerequisites
Node.js (v16+ recommended)
npm
Installation
git clone <your-repo-url>
cd project
npm install
Running the App
npm run dev
Open your browser at http://localhost:5173/.
Usage
Build a Workflow:
Drag components from the sidebar to the canvas to create your workflow.
Configure Components:
Click on nodes to set properties (e.g., API key for LLM, upload documents for Knowledge Base).
Chat with AI:
Open the chat modal and ask questions. The AI will use your workflow configuration and uploaded documents for context.
No API Key?
The app will use mock responses if no OpenAI API key is provided.

Project Structure
src/
  components/         # UI components (ChatModal, Sidebar, etc.)
  hooks/              # Custom hooks (useChat, useAuth, etc.)
  services/           # API integrations (openaiService)
  types/              # TypeScript types/interfaces
  constants/          # Static config (component templates)
  App.tsx             # Main app entry

  Architecture Overview
App.tsx: Main entry, manages layout and state.
Sidebar.tsx: Lists available components for workflow.
WorkflowCanvas/WorkflowNode.tsx: Renders nodes and connections.
ChatModal.tsx: Chat interface modal.
useChat.ts: Custom hook for chat logic.
openaiService.ts: Handles OpenAI API calls.
Extending the App
Add new components to src/constants/components.ts.
Integrate other LLMs by adding new service files in src/services/.
Customize the UI or workflow logic as needed.
