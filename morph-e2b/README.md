# Morph E2B Demo - AI React App Builder

<div align="center">
  
[![Morph](https://www.morphllm.com/logos/48.svg)](https://www.morphllm.com)

**Powered by [Morph](https://www.morphllm.com) - The Fastest Way to Apply AI Edits**

*4,500+ tokens/sec edits with 98% accuracy*

</div>

An AI-powered React application builder that demonstrates Morph's intelligent code editing capabilities. Create complete single-page applications through natural language conversation, with real-time code generation and intelligent editing powered by Morph's specialized AI model.

## Features

- **⚡ Morph-Powered Code Editing**: Lightning-fast code transformations at 4,500+ tokens/second with 98% accuracy
- **🤖 AI-Powered Code Generation**: Creates complete React applications from natural language descriptions
- **👀 Real-time Preview**: Live preview of generated applications in an iframe
- **💬 Interactive Chat Interface**: Conversational UI for describing and iterating on your applications
- **🎨 Modern UI**: Clean, dark-themed interface with separate panels for code, preview, and chat
- **🔄 Intelligent Code Editing**: Uses Morph's specialized AI model for precise code modifications

## Tech Stack

- **[Morph](https://www.morphllm.com)** - Specialized AI model for lightning-fast code editing (4,500+ tokens/sec)
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **OpenAI GPT-3.5-turbo** - AI language model for understanding user requests
- **E2B** - Code execution and preview environment
- **Vercel AI SDK** - AI integration and streaming responses

## Getting Started

### Prerequisites

You'll need API keys for:
- **[Morph](https://www.morphllm.com/api-keys)** - For lightning-fast code editing and transformations
- **OpenAI** - For the AI agent conversation interface
- **E2B** (optional) - For advanced code execution features

> 💡 **Get started with Morph**: Visit [docs.morphllm.com](https://docs.morphllm.com) for comprehensive documentation and API guides.

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd morph-e2b
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API keys:
```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Morph API Key
MORPH_API_KEY=your_morph_api_key_here

# E2B API Key (optional)
E2B_API_KEY=your_e2b_api_key_here

# App URL (automatically set based on current port)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) with your browser.

## Usage

1. **Start a Conversation**: Type what kind of React app you want to create
   - "Create a modern SaaS landing page"
   - "Build a portfolio website"
   - "Make a product showcase page"

2. **View Real-time Results**: 
   - Code appears in the left panel
   - Live preview shows in the right panel
   - Chat interface tracks the AI's progress

3. **Iterate and Improve**: Continue the conversation to modify and enhance your application

## API Endpoints

- `/api/agent` - Main AI agent endpoint that handles chat and tool execution
- `/api/e2b` - Code execution endpoint for rendering HTML previews
- `/api/debug` - Debug utilities for checking and clearing stored code

## Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main application interface
├── lib/
│   ├── storage.ts     # In-memory code storage
│   └── utils.ts       # Utility functions
└── .env.local         # Environment variables (create this)
```

## How Morph Powers the Demo

This demo showcases Morph's capabilities through an AI agent that uses three main tools:

1. **createFile** - Creates new HTML files with complete React applications
2. **editFile** - 🚀 **Powered by Morph** - Uses Morph's specialized AI model to intelligently edit existing code with lightning speed and precision
3. **executeCode** - Renders the current code in the preview panel

### Why Morph?

- **⚡ Speed**: 4,500+ tokens per second for rapid code transformations
- **🎯 Accuracy**: 98% accuracy in code edits and transformations  
- **🧠 Intelligence**: Specialized AI model trained specifically for code editing tasks
- **🔄 Seamless Integration**: Easy-to-use API that integrates with any workflow

## Development

- The application uses in-memory storage for code during development
- All generated applications are single HTML files with embedded React
- The AI automatically calls execution after creating/editing code

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and for demonstration purposes.

## Learn More About Morph

- 🌐 **Website**: [www.morphllm.com](https://www.morphllm.com)
- 📚 **Documentation**: [docs.morphllm.com](https://docs.morphllm.com)
- 🔑 **Get API Keys**: [morphllm.com/api-keys](https://www.morphllm.com/api-keys)
- 🎮 **Try the Playground**: [morphllm.com/dashboard/playground/apply](https://www.morphllm.com/dashboard/playground/apply)

---

<div align="center">

**Powered by [Morph](https://www.morphllm.com) - The Fastest Way to Apply AI Edits**

*Built by AutoInfra, Inc. | [info@morphllm.com](mailto:info@morphllm.com)*

</div>