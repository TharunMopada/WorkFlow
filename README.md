🧠 AI Workflow Builder

A visual no-code/low-code workflow builder for AI-powered automation. Create, configure, and interact with custom AI workflows using intuitive drag-and-drop components.
✨ Features

    🎛️ Visual Workflow Builder
    Drag and drop components like User Query, Knowledge Base, LLM Engine, and Output to build powerful AI workflows.

    💬 Chat Interface
    Ask questions in a dynamic chat modal. The app uses your configured workflow to generate context-aware answers.

    📄 Document Upload
    Upload PDFs to your Knowledge Base for contextual retrieval and intelligent answers.

    🤖 Pluggable LLM Support
    Integrate with OpenAI (or fallback to mock responses if no API key is provided).

    ⚡ Modern Stack
    Built with React, TypeScript, Vite, Tailwind CSS, and React Flow.

🚀 Getting Started
✅ Prerequisites

    Node.js (v16+ recommended)

    npm (comes with Node)

📦 Installation

git clone <your-repo-url>
cd project
npm install

▶️ Run the App

npm run dev

Then open your browser at:
👉 http://localhost:5173/
🛠️ Usage
1. Build a Workflow

    Drag components from the left sidebar into the canvas

    Connect them in logical order:

    User Query → [Optional] Knowledge Base → LLM Engine → Output

2. Configure Components

    Click any node to configure its settings:

        📄 Upload PDFs in Knowledge Base

        🔐 Enter OpenAI API key in LLM Engine

        ✏️ Add optional prompts or toggle web search

3. Chat with AI

    Click on "Chat with Stack"

    Type your question and get intelligent responses based on:

        Your uploaded documents

        Selected language model (OpenAI, Gemini)

        Custom prompts

4. No API Key?

    If no OpenAI API key is configured, the app will respond with mock answers for development/testing.

🗂️ Project Structure

src/
├── components/         # UI components (Sidebar, ChatModal, etc.)
├── hooks/              # Custom React hooks (useChat, useWorkflow, etc.)
├── services/           # API services (OpenAI, Gemini, etc.)
├── types/              # TypeScript interfaces and types
├── constants/          # Component templates and static configs
├── App.tsx             # Main app entry point
└── main.tsx            # Vite bootstrap

🧱 Architecture Overview
File / Component	Role
App.tsx	Main entry, manages layout and state
Sidebar.tsx	Renders list of draggable components
WorkflowCanvas.tsx	Manages visual workflow with React Flow
WorkflowNode.tsx	Individual configurable node logic
ChatModal.tsx	Chat interface popup
useChat.ts	Hook for managing chat input/output
openaiService.ts	Handles interaction with OpenAI API
🧩 Extending the App
Task	How To
➕ Add new components	Add them in src/constants/components.ts
🔌 Use a different LLM	Create a new service in src/services/
🎨 Customize styling	Modify Tailwind classes in component files
🔄 Save workflows	Connect to PostgreSQL or local storage
📽️ Demo & Deployment
🎥 Demo Video (Recommended)

    Record using OBS Studio or Loom

    Show: workflow creation, document upload, and chat interaction

🌐 Hosted App (Optional)

    https://your-app.vercel.app
    or:

    Run locally at http://localhost:5173/

🧪 Coming Soon

    Backend (FastAPI) with document processing and vector DB

    Workflow saving/loading

    User authentication

    Advanced node types (agents, tools, retrievers)

    Kubernetes-ready Docker containers

    Monitoring & logging (Prometheus + Grafana)

🧑‍💻 License

This project is open-source under the MIT License.
