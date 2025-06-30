import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Check if API key is available
const apiKey = process.env.OPENAI_API_KEY
const openai = apiKey ? new OpenAI({ apiKey }) : null

// Enhanced fallback responses for common questions when API is unavailable
const fallbackResponses: { [key: string]: string } = {
  'order': `📋 **Order Management Guide:**

• **View Orders**: Click "Orders" in the sidebar to see all orders
• **Create New Order**: Use the "Add Order" button in the Orders section
• **Update Status**: Click on any order to edit its status
• **Order Details**: View customer info, items, and payment status
• **Filter Orders**: Use the search and filter options to find specific orders

The Orders section shows order ID, customer name, total amount, status, and date.`,
  
  'customer': `👥 **Customer Management Guide:**

• **View Customers**: Click "Customers" in the sidebar
• **Customer Details**: Click on any customer to see their profile
• **Contact Info**: View email, phone, and address information
• **Order History**: See all orders placed by each customer
• **Add Customer**: Use the "Add Customer" button to create new customers

The Customers section displays customer name, email, phone, total orders, and total spent.`,
  
  'inventory': `📦 **Inventory Management Guide:**

• **Stock Levels**: Check current inventory quantities
• **Low Stock Alerts**: Items with low stock are highlighted
• **Add Items**: Use "Add Item" to add new products
• **Update Stock**: Edit quantities and product details
• **Categories**: Organize items by categories

Note: The Inventory section shows item name, category, quantity, price, and status.`,
  
  'dashboard': `📊 **Dashboard Overview:**

• **Total Revenue**: Shows your total earnings (₹ symbol)
• **Total Orders**: Number of orders in the system
• **Active Customers**: Number of registered customers
• **Inventory Items**: Total number of products in stock
• **Charts**: Sales trends and order statistics
• **Recent Activity**: Latest system updates

The dashboard provides a quick overview of your business performance.`,
  
  'report': `📈 **Reports & Analytics:**

• **Sales Reports**: View revenue trends and performance
• **Order Analytics**: Order statistics and patterns
• **Customer Insights**: Customer behavior and preferences
• **Inventory Reports**: Stock movement and turnover
• **Export Data**: Download reports in various formats

The Reports section helps you analyze business performance and make data-driven decisions.`,
  
  'help': `🤖 **AI Assistant Help:**

I can help you with:
• **Order Management**: Creating, viewing, and updating orders
• **Customer Information**: Customer details and order history
• **Inventory Status**: Stock levels and product management
• **System Navigation**: Finding features and understanding the interface
• **Reports & Analytics**: Business insights and performance data

Just ask me about any of these areas!`,
  
  'default': `🎯 **Welcome to Your Ordering System!**

I'm your AI assistant, here to help you manage your business. You can ask me about:

• **Orders**: How to create, view, or manage orders
• **Customers**: Customer information and order history
• **Inventory**: Stock levels and product management
• **Dashboard**: Understanding your business metrics
• **Reports**: Sales analytics and performance data

What would you like to know about?`
}

function getFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  if (message.includes('order') || message.includes('create order') || message.includes('view order')) 
    return fallbackResponses.order
  if (message.includes('customer') || message.includes('client') || message.includes('contact')) 
    return fallbackResponses.customer
  if (message.includes('inventory') || message.includes('stock') || message.includes('product') || message.includes('item')) 
    return fallbackResponses.inventory
  if (message.includes('dashboard') || message.includes('metric') || message.includes('revenue') || message.includes('overview')) 
    return fallbackResponses.dashboard
  if (message.includes('report') || message.includes('analytics') || message.includes('statistics')) 
    return fallbackResponses.report
  if (message.includes('help') || message.includes('assist') || message.includes('guide')) 
    return fallbackResponses.help
  
  return fallbackResponses.default
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const lastUserMessage = messages[messages.length - 1]?.content || ''

    const systemPrompt = `You are an AI assistant for an Ordering System ERP. You help users with:

1. Order Management: Track orders, update status, view order history
2. Customer Management: Customer information, contact details, order history
3. Inventory Management: Stock levels, low stock alerts, inventory updates
4. Sales Analytics: Revenue reports, sales trends, performance metrics
5. System Navigation: Help users find features and understand the interface

Be helpful, concise, and provide actionable information. If you don't have access to specific data, guide users on how to find it in the system.`

    try {
      console.log('Attempting OpenAI API call...')
      
      // Check if OpenAI client is available
      if (!openai) {
        const fallbackResponse = getFallbackResponse(lastUserMessage)
        return NextResponse.json({
          role: 'assistant',
          content: `${fallbackResponse}\n\n💡 **Note**: OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables for real-time AI responses.`,
        })
      }
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Better limits: 15,000 TPM, 500 RPM, 10,000 RPD
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      console.log('OpenAI API call successful')
      return NextResponse.json({
        role: 'assistant',
        content: response.choices[0].message.content,
      })
    } catch (apiError: any) {
      // Enhanced error logging
      console.error('OpenAI API error details:', {
        status: apiError.status,
        code: apiError.code,
        type: apiError.type,
        message: apiError.message,
        error: apiError.error
      })
      
      if (apiError.code === 'insufficient_quota' || apiError.status === 429) {
        const fallbackResponse = getFallbackResponse(lastUserMessage)
        return NextResponse.json({
          role: 'assistant',
          content: `${fallbackResponse}\n\n💡 **Note**: I'm currently using fallback responses due to API quota limits. To enable real-time AI responses:\n\n1. Visit https://platform.openai.com/account/billing\n2. Add a payment method to your account\n3. Check your usage limits at https://platform.openai.com/account/limits\n\nYour chatbot will continue to work with helpful responses in the meantime!`,
        })
      }
      
      // For other API errors, return a generic fallback
      return NextResponse.json({
        role: 'assistant',
        content: getFallbackResponse(lastUserMessage),
      })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
} 