import { useState, useEffect, useCallback } from 'react'
import {
  initializeGemini,
  generatePlan,
  generateStepResponse,
  generateChatResponse
} from '../services/geminiService'

/**
 * useGemini Hook
 *
 * This is a custom React hook that makes it easy to use Gemini in components.
 *
 * WHAT IS A HOOK?
 * Hooks are special functions in React that let you "hook into" React features.
 * Custom hooks (like this one) let you share logic between components.
 *
 * HOW TO USE THIS:
 * const { isReady, isLoading, error, createPlan, sendStepMessage } = useGemini()
 *
 * - isReady: true when Gemini is initialized and ready to use
 * - isLoading: true while waiting for an API response
 * - error: contains error message if something went wrong
 * - createPlan: function to generate a step-by-step plan
 * - sendStepMessage: function to chat within a specific step
 * - sendChatMessage: function for general chat before plan creation
 */
export function useGemini() {
  // Track if Gemini is ready to use
  const [isReady, setIsReady] = useState(false)

  // Track loading state during API calls
  const [isLoading, setIsLoading] = useState(false)

  // Track any errors
  const [error, setError] = useState(null)

  // Initialize Gemini when the hook is first used
  useEffect(() => {
    const ready = initializeGemini()
    setIsReady(ready)
    if (!ready) {
      setError('Gemini API not configured. Please add your API key to .env file.')
    }
  }, [])

  /**
   * Create a step-by-step plan from a user's request
   *
   * @param {string} message - What the user wants to accomplish
   * @returns {Object|null} - The generated plan, or null if failed
   */
  const createPlan = useCallback(async (message) => {
    if (!isReady) {
      setError('Gemini not ready. Check your API key.')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const plan = await generatePlan(message)
      return plan
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isReady])

  /**
   * Send a message within a specific step's conversation
   *
   * @param {string} message - The user's message
   * @param {Object} step - The current step
   * @param {Array} previousMessages - Previous messages in this step
   * @param {Array} completedSteps - Previously completed steps
   * @returns {string|null} - The AI response, or null if failed
   */
  const sendStepMessage = useCallback(async (message, step, previousMessages = [], completedSteps = []) => {
    if (!isReady) {
      setError('Gemini not ready. Check your API key.')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await generateStepResponse(message, step, previousMessages, completedSteps)
      return response
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isReady])

  /**
   * Send a general chat message (before plan is created)
   *
   * @param {string} message - The user's message
   * @param {Array} previousMessages - Previous messages in the conversation
   * @returns {string|null} - The AI response, or null if failed
   */
  const sendChatMessage = useCallback(async (message, previousMessages = []) => {
    if (!isReady) {
      setError('Gemini not ready. Check your API key.')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await generateChatResponse(message, previousMessages)
      return response
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isReady])

  /**
   * Clear any error message
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isReady,
    isLoading,
    error,
    createPlan,
    sendStepMessage,
    sendChatMessage,
    clearError
  }
}
