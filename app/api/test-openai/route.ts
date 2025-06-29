import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  try {
    console.log('Testing OpenAI API connection...')
    
    // Test with a simple completion
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
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