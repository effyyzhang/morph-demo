# Morph Demo - Document Editor

A Notion-like document editor with AI transformations powered by Plate.js and Morph. This demo showcases document-wide edits with lightning-fast transformations using Morph's 2000+ tokens/second processing speed.

## ✨ Features

- **Notion-like Editor**: Clean, modern document editing experience built with Plate.js
- **AI Transformations**: 7 different document transformation types
- **Morph Integration**: Ultra-fast document processing (2000+ tokens/sec)
- **OpenAI Fallback**: Standard AI transformations when Morph is disabled
- **Real-time Stats**: Word count, character count, and reading time
- **Document History**: Undo/redo functionality with snapshot management
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Keyboard Shortcuts**: Notion-style shortcuts for productivity

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Morph API key (get one at [morphllm.com](https://morphllm.com))
- OpenAI API key (optional, for fallback)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd morph-demo
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   MORPH_API_KEY=your_morph_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### Basic Editing
- Start typing in the editor to modify the demo content
- Use standard text formatting (bold, italic, headings, lists)
- The editor supports markdown-style shortcuts

### AI Transformations
1. **Toggle Morph Mode**: Use the switch in the sidebar to enable/disable Morph
2. **Select Transformation**: Click any transformation button in the sidebar
3. **Watch the Magic**: See your document transform in real-time
4. **Reset if Needed**: Use the Reset button to return to original content

### Available Transformations

| Transformation | Description |
|----------------|-------------|
| 🔄 **Restructure** | Reorganize with clear headings and logical flow |
| 📋 **Executive Summary** | Create comprehensive summary with key insights |
| 🔍 **Expand Details** | Add detailed explanations and examples |
| ✨ **Simplify Language** | Rewrite using simpler, clearer language |
| 🎓 **Academic Style** | Transform to formal academic writing |
| 💼 **Business Proposal** | Convert to business proposal format |
| 📚 **Tutorial Format** | Restructure as step-by-step tutorial |

### Keyboard Shortcuts
- `Cmd/Ctrl + Z`: Undo
- `Cmd/Ctrl + Shift + Z`: Redo
- `Cmd/Ctrl + B`: Bold
- `Cmd/Ctrl + I`: Italic

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Editor**: Plate.js (Slate.js based)
- **Styling**: Tailwind CSS with custom Notion-like theme
- **Animations**: Framer Motion
- **AI Integration**: Morph API, OpenAI API
- **State Management**: React hooks with custom state management

### Project Structure
```
morph-demo/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── morph/         # Morph integration
│   │   └── openai/        # OpenAI integration
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── DocumentEditor.tsx # Main editor component
│   └── TransformationPanel.tsx # AI sidebar
├── hooks/                # Custom React hooks
│   ├── useDocumentTransforms.ts
│   └── useDocumentHistory.ts
├── lib/                  # Utilities and constants
│   ├── constants.ts      # App constants
│   └── utils.ts          # Helper functions
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MORPH_API_KEY` | Your Morph API key | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | Optional |

### Customization

#### Adding New Transformations
Edit `lib/constants.ts` to add new transformation types:

```typescript
export const DOCUMENT_TRANSFORMS = {
  // ... existing transformations
  myCustomTransform: {
    name: 'My Custom Transform',
    prompt: 'Your transformation prompt here',
    icon: '🎨',
  },
};
```

#### Styling
The app uses a custom Notion-like theme. Modify `tailwind.config.js` to customize colors and spacing.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Plate.js](https://platejs.org/) for the excellent rich text editor
- [Morph](https://morphllm.com/) for ultra-fast AI transformations
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Notion](https://notion.so/) for design inspiration

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the [Plate.js documentation](https://platejs.org/docs)
- Visit [Morph documentation](https://docs.morphllm.com/)

---

**Happy coding! 🎉** 