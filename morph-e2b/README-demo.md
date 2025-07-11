# E2B + Morph Chat Demo

A minimal demo showing how E2B and Morph work together to create and update applications through natural language chat.

## How it works

1. **Create**: Chat with AI to generate initial code → E2B executes it
2. **Update**: Request changes → Morph applies them at 4500+ tokens/sec → E2B shows updated result

## Setup

1. Add your API keys to `.env.local`:
```
E2B_API_KEY=your_e2b_api_key
MORPH_API_KEY=your_morph_api_key
OPENAI_API_KEY=your_openai_api_key
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Usage

1. Start by asking the AI to create an app:
   - "Create a simple counter app"
   - "Build a todo list"
   - "Make a calculator"

2. Then request updates:
   - "Add a reset button"
   - "Change the color to blue"
   - "Add local storage"

The demo will show:
- Chat conversation on the left
- Generated/updated code and live preview on the right
- Morph's fast transformation when updating existing code