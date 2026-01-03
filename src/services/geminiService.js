/**
 * Gemini API Service
 *
 * This file handles all communication with the Gemini API.
 * It's separated from React components so it can be easily tested and reused.
 *
 * HOW IT WORKS:
 * 1. We import the Google Generative AI library
 * 2. We initialize it with your API key (from .env file)
 * 3. We provide functions to generate plans and chat responses
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

// Get the API key from environment variables
// VITE_ prefix is required for Vite to expose env vars to the frontend
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Initialize the Gemini client
// This creates a connection to Google's AI service
let genAI = null
let model = null

/**
 * Initialize the Gemini client
 * Called once when the app starts
 */
export function initializeGemini() {
  // Log for debugging - remove in production
  console.log('Initializing Gemini...')
  console.log('API Key present:', !!API_KEY)
  console.log('API Key length:', API_KEY ? API_KEY.length : 0)

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.warn('Gemini API key not configured. Please add your key to .env file.')
    return false
  }

  try {
    genAI = new GoogleGenerativeAI(API_KEY)
    // Using gemini-1.5-flash-latest - widely available on free tier
    // If you hit quota limits, wait a minute or check: https://ai.dev/usage
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    console.log('Gemini initialized successfully!')
    return true
  } catch (error) {
    console.error('Failed to initialize Gemini:', error)
    return false
  }
}

/**
 * Generate a step-by-step plan from a user's request
 *
 * @param {string} userMessage - What the user wants to accomplish
 * @returns {Object} - A plan object with steps array
 */
export async function generatePlan(userMessage) {
  if (!model) {
    throw new Error('Gemini not initialized. Check your API key.')
  }

  // System prompt tells Gemini how to respond
  const systemPrompt = [
    'You are a helpful assistant that creates step-by-step plans.',
    'When given a task or question, respond with a structured plan in JSON format.',
    '',
    'IMPORTANT: Respond ONLY with valid JSON, no markdown code blocks or extra text.',
    '',
    'The JSON should have this structure:',
    '{',
    '  "title": "Brief title for the plan",',
    '  "steps": [',
    '    {',
    '      "title": "Step One",',
    '      "description": "Brief description of what this step involves",',
    '      "subParts": ["Part 1a description", "Part 1b description"]',
    '    }',
    '  ]',
    '}',
    '',
    'Guidelines:',
    '- Create 3-5 clear, actionable steps',
    '- Each step should have a descriptive title',
    '- Include 1-3 sub-parts per step when helpful',
    '- Keep descriptions concise but informative',
    '- Make steps sequential and logical'
  ].join('\n')

  const prompt = systemPrompt + '\n\nUser\'s request: ' + userMessage + '\n\nRespond with the JSON plan:'

  try {
    console.log('Sending request to Gemini...')
    const result = await model.generateContent(prompt)
    console.log('Got result:', result)
    const response = await result.response
    console.log('Got response:', response)
    const text = response.text()
    console.log('Raw response text:', text)

    // Parse the JSON response
    // Remove any markdown code blocks if present
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
    console.log('Cleaned text:', cleanedText)
    const plan = JSON.parse(cleanedText)
    console.log('Parsed plan:', plan)

    return plan
  } catch (error) {
    console.error('Error generating plan:', error)
    console.error('Error details:', error.message, error.stack)
    throw new Error('Failed to generate plan. Please try again.')
  }
}

/**
 * Generate a chat response for a specific step
 *
 * @param {string} userMessage - The user's message
 * @param {Object} step - The current step being worked on
 * @param {Array} previousMessages - Previous messages in this step's conversation
 * @param {Array} completedSteps - Steps that have been completed (for context)
 * @returns {string} - The assistant's response
 */
export async function generateStepResponse(userMessage, step, previousMessages = [], completedSteps = []) {
  if (!model) {
    throw new Error('Gemini not initialized. Check your API key.')
  }

  // Build context from previous messages
  const conversationHistory = previousMessages
    .map(m => (m.role === 'user' ? 'User' : 'Assistant') + ': ' + m.content)
    .join('\n')

  // Build context from completed steps
  const completedContext = completedSteps.length > 0
    ? '\nPreviously completed steps:\n' + completedSteps.map(s => '- ' + s.title + ': ' + s.description).join('\n')
    : ''

  const subPartsText = step.subParts ? 'Sub-parts to cover: ' + step.subParts.join(', ') : ''
  const historyText = conversationHistory ? 'Conversation so far:\n' + conversationHistory + '\n' : ''

  const systemPrompt = [
    'You are helping a user complete a specific step in their plan.',
    '',
    'Current step: ' + step.title,
    'Step description: ' + step.description,
    subPartsText,
    completedContext,
    '',
    historyText,
    'Guidelines:',
    '- Focus on helping with THIS specific step',
    '- Be concise and actionable',
    '- If the user asks something outside this step\'s scope, gently redirect them',
    '- Suggest when they might be ready to move to the next step'
  ].join('\n')

  const prompt = systemPrompt + '\n\nUser: ' + userMessage

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return text
  } catch (error) {
    console.error('Error generating step response:', error)
    throw new Error('Failed to generate response. Please try again.')
  }
}

/**
 * Generate a simple chat response (before plan is created)
 *
 * @param {string} userMessage - The user's message
 * @param {Array} previousMessages - Previous messages in the conversation
 * @returns {string} - The assistant's response
 */
export async function generateChatResponse(userMessage, previousMessages = []) {
  if (!model) {
    throw new Error('Gemini not initialized. Check your API key.')
  }

  const conversationHistory = previousMessages
    .map(m => (m.role === 'user' ? 'User' : 'Assistant') + ': ' + m.content)
    .join('\n')

  const systemPrompt = [
    'You are a helpful assistant. When the user describes a task or project,',
    'you should offer to create a step-by-step plan for them.',
    '',
    conversationHistory ? 'Conversation so far:\n' + conversationHistory + '\n' : ''
  ].join('\n')

  const prompt = systemPrompt + '\nUser: ' + userMessage

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return text
  } catch (error) {
    console.error('Error generating chat response:', error)
    throw new Error('Failed to generate response. Please try again.')
  }
}
