import { createContext, useContext, useState, useCallback } from 'react'

/**
 * ChatContext - Manages all chat and step-related state
 *
 * WHAT IS CONTEXT?
 * Context is React's way of sharing data between components without
 * passing props down through every level. Think of it like a "global state"
 * that any component can access.
 *
 * HOW IT WORKS:
 * 1. We create a context (ChatContext)
 * 2. We create a provider component (ChatProvider) that holds the state
 * 3. Any component inside ChatProvider can use useChatContext() to access the state
 */

// Create the context - this is like creating an empty container
const ChatContext = createContext(null)

/**
 * Generate a unique ID for new items
 * This is a simple way to create unique identifiers
 */
const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

/**
 * ChatProvider Component
 *
 * This wraps our app and provides all the chat-related state and functions
 * to any component that needs them.
 */
export function ChatProvider({ children }) {
  // =========================================
  // STATE DEFINITIONS
  // =========================================

  // List of all chat threads (shown in left sidebar)
  const [threads, setThreads] = useState([
    {
      id: 'thread-1',
      title: 'New Chat',
      createdAt: new Date().toISOString(),
    }
  ])

  // Which thread is currently selected
  const [currentThreadId, setCurrentThreadId] = useState('thread-1')

  // The current phase of the chat: 'chatting' | 'planning' | 'executing'
  // - 'chatting': Normal chat, no plan yet
  // - 'planning': A plan has been generated, user can accept/modify
  // - 'executing': User accepted the plan, working through steps
  const [phase, setPhase] = useState('chatting')

  // Messages in the main chat (before entering step mode)
  const [messages, setMessages] = useState([])

  // The generated plan with steps
  const [plan, setPlan] = useState(null)

  // Which step is currently active (0-indexed)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(false)

  // =========================================
  // HELPER FUNCTIONS
  // =========================================

  /**
   * Get the current thread object
   */
  const getCurrentThread = useCallback(() => {
    return threads.find(t => t.id === currentThreadId)
  }, [threads, currentThreadId])

  /**
   * Get the current step (if in executing phase)
   */
  const getCurrentStep = useCallback(() => {
    if (phase !== 'executing' || !plan) return null
    return plan.steps[currentStepIndex]
  }, [phase, plan, currentStepIndex])

  // =========================================
  // ACTION FUNCTIONS
  // These functions modify the state
  // =========================================

  /**
   * Create a new chat thread
   */
  const createThread = useCallback(() => {
    const newThread = {
      id: generateId(),
      title: 'New Chat',
      createdAt: new Date().toISOString(),
    }
    setThreads(prev => [...prev, newThread])
    setCurrentThreadId(newThread.id)
    // Reset chat state for new thread
    setPhase('chatting')
    setMessages([])
    setPlan(null)
    setCurrentStepIndex(0)
    return newThread.id
  }, [])

  /**
   * Select a different thread
   */
  const selectThread = useCallback((threadId) => {
    setCurrentThreadId(threadId)
    // In a real app, we'd load the thread's messages here
    // For now, we'll reset to empty state
    setPhase('chatting')
    setMessages([])
    setPlan(null)
    setCurrentStepIndex(0)
  }, [])

  /**
   * Add a message to the chat
   * role: 'user' | 'assistant'
   */
  const addMessage = useCallback((role, content) => {
    const newMessage = {
      id: generateId(),
      role,
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }, [])

  /**
   * Set the generated plan
   * This is called after Gemini generates a step-by-step plan
   */
  const setGeneratedPlan = useCallback((planData) => {
    // Add IDs and initial status to each step
    const planWithIds = {
      ...planData,
      id: generateId(),
      steps: planData.steps.map((step, index) => ({
        ...step,
        id: generateId(),
        status: index === 0 ? 'active' : 'pending',
        messages: [], // Each step has its own conversation
      }))
    }
    setPlan(planWithIds)
    setPhase('planning')
  }, [])

  /**
   * Accept the plan and start executing
   */
  const acceptPlan = useCallback(() => {
    setPhase('executing')
    setCurrentStepIndex(0)
  }, [])

  /**
   * Navigate to a specific step
   */
  const goToStep = useCallback((stepIndex) => {
    if (!plan || stepIndex < 0 || stepIndex >= plan.steps.length) return
    setCurrentStepIndex(stepIndex)

    // Update step statuses
    setPlan(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => ({
        ...step,
        status: index < stepIndex ? 'completed' :
                index === stepIndex ? 'active' : 'pending'
      }))
    }))
  }, [plan])

  /**
   * Complete the current step and move to next
   */
  const completeCurrentStep = useCallback(() => {
    if (!plan) return

    const nextIndex = currentStepIndex + 1

    // If there are more steps, move to next
    if (nextIndex < plan.steps.length) {
      goToStep(nextIndex)
    } else {
      // All steps completed
      setPlan(prev => ({
        ...prev,
        steps: prev.steps.map(step => ({ ...step, status: 'completed' }))
      }))
    }
  }, [plan, currentStepIndex, goToStep])

  /**
   * Add a message to the current step's conversation
   */
  const addStepMessage = useCallback((role, content) => {
    if (!plan || phase !== 'executing') return

    const newMessage = {
      id: generateId(),
      role,
      content,
      timestamp: new Date().toISOString(),
    }

    setPlan(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) =>
        index === currentStepIndex
          ? { ...step, messages: [...step.messages, newMessage] }
          : step
      )
    }))

    return newMessage
  }, [plan, phase, currentStepIndex])

  /**
   * Update the thread title (usually after first message)
   */
  const updateThreadTitle = useCallback((title) => {
    setThreads(prev => prev.map(thread =>
      thread.id === currentThreadId
        ? { ...thread, title }
        : thread
    ))
  }, [currentThreadId])

  // =========================================
  // CONTEXT VALUE
  // All the state and functions we want to share
  // =========================================

  const value = {
    // State
    threads,
    currentThreadId,
    phase,
    messages,
    plan,
    currentStepIndex,
    isLoading,

    // Computed values
    getCurrentThread,
    getCurrentStep,

    // Actions
    createThread,
    selectThread,
    addMessage,
    setGeneratedPlan,
    acceptPlan,
    goToStep,
    completeCurrentStep,
    addStepMessage,
    updateThreadTitle,
    setIsLoading,
    setPhase,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

/**
 * Custom hook to use the chat context
 *
 * This is a convenient way for components to access the context.
 * Instead of: const context = useContext(ChatContext)
 * Components can do: const { messages, addMessage } = useChatContext()
 */
export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
