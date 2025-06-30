import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Check if API key is available
const apiKey = process.env.OPENAI_API_KEY
const openai = apiKey ? new OpenAI({ apiKey }) : null

export async function GET() {
  try {
    console.log('Testing OpenAI API connection...')
    
    // Check if OpenAI client is available
    if (!openai) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.'
        }
      }, { status: 400 })
    }
    
    // Test with a simple completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Better limits: 15,000 TPM, 500 RPM, 10,000 RPD
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10,
    })

    return NextResponse.json({
      success: true,
      message: 'API key is working!',
      response: response.choices[0].message.content,
      usage: response.usage
    })
  } catch (error: any) {
    console.error('OpenAI test error:', {
      status: error.status,
      code: error.code,
      type: error.type,
      message: error.message,
      error: error.error
    })

    return NextResponse.json({
      success: false,
      error: {
        status: error.status,
        code: error.code,
        type: error.type,
        message: error.message
      }
    }, { status: 400 })
  }
} 