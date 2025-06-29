# CopilotKit AI Chatbot Setup

## Overview
This ordering system now includes an AI-powered chatbot using CopilotKit and OpenAI. The chatbot can help users with order management, customer information, inventory status, and system navigation.

## Features
- **Floating Chat Interface**: Accessible from any page via a floating button
- **Context-Aware Responses**: AI understands the ordering system context
- **Real-time Chat**: Instant responses with loading indicators
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Environment Variables (IMPORTANT)
**Manual Setup Required**: Create a `.env.local` file in the root directory manually:

1. Open your file explorer
2. Navigate to the project root directory (`C:\Users\Admin\Desktop\Data\OrderingSystem`)
3. Create a new file named `.env.local` (make sure to include the dot at the beginning)
4. Add the following content to the file:

```env
# OpenAI API Key for AI Chatbot
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (if not already set)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Alternative**: You can also create a `.env` file with the same content if `.env.local` doesn't work.

### 2. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and replace `your_openai_api_key_here` in your `.env.local` file

### 3. Install Dependencies
The required packages are already installed:
- `@copilotkit/react-core`
- `@copilotkit/react-ui`
- `@copilotkit/react-textarea`
- `@copilotkit/shared`
- `openai`

### 4. Start the Development Server
```bash
npm run dev
```

## Usage

### Accessing the Chatbot
- Click the blue chat bubble icon in the bottom-right corner of any page
- The chat window will open with a welcome message
- Type your questions and press Enter or click the send button

### Example Questions
- "How do I create a new order?"
- "Show me recent customer orders"
- "What's the current inventory status?"
- "How do I navigate to the reports section?"
- "Help me understand the dashboard metrics"

### Chatbot Capabilities
1. **Order Management**
   - Order creation and tracking
   - Status updates
   - Order history queries

2. **Customer Management**
   - Customer information lookup
   - Contact details
   - Order history per customer

3. **Inventory Management**
   - Stock level inquiries
   - Low stock alerts
   - Inventory updates

4. **Sales Analytics**
   - Revenue reports
   - Sales trends
   - Performance metrics

5. **System Navigation**
   - Feature explanations
   - Interface guidance
   - Workflow assistance

## Technical Implementation

### Components
- `Chatbot.tsx`: Main chat interface component
- `app/api/chat/route.ts`: API endpoint for chat processing
- `app/layout.tsx`: CopilotKit provider wrapper

### API Integration
The chatbot uses OpenAI's GPT-3.5-turbo model with a custom system prompt tailored for the ordering system context.

### Styling
The chat interface uses Tailwind CSS classes and integrates seamlessly with the existing design system.

## Troubleshooting

### Common Issues
1. **"Failed to get response" error**
   - Check if your OpenAI API key is correctly set in `.env.local`
   - Verify the API key has sufficient credits
   - Ensure the development server is running

2. **Chat not appearing**
   - Check browser console for JavaScript errors
   - Verify all dependencies are installed
   - Restart the development server

3. **Slow responses**
   - This is normal for AI responses
   - Consider upgrading to GPT-4 for faster responses
   - Check your internet connection

4. **Environment file issues**
   - Make sure the `.env.local` file is in the root directory
   - Verify the file name starts with a dot (`.env.local`)
   - Check that there are no extra spaces in the file
   - Restart the development server after creating the file

### Support
For technical issues, check the browser console for error messages and ensure all environment variables are properly configured. 