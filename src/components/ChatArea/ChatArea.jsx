import { useRef, useEffect } from 'react'
import { useChatContext } from '../../context/ChatContext'
import { useGemini } from '../../hooks/useGemini'
import MessageBubble from '../MessageBubble/MessageBubble'
import ChatInput from '../ChatInput/ChatInput'
import PlanArtifact from '../PlanArtifact/PlanArtifact'
import StepNavInline, { StepNavInlineFooter } from '../StepNavInline/StepNavInline'
import StepNavSidebar from '../StepNavSidebar/StepNavSidebar'
import './ChatArea.css'

/**
 * ChatArea Component
 *
 * The main chat area where conversations happen.
 * This is the most complex component as it:
 * 1. Shows messages and the plan artifact
 * 2. Handles sending messages and generating plans
 * 3. Switches between layout variants (inline vs sidebar)
 * 4. Manages the step-by-step execution flow
 *
 * PROPS:
 * - layout: 'inline' | 'sidebar' - which layout variant to use
 *
 * PHASES:
 * - 'chatting': Normal chat, no plan yet
 * - 'planning': Plan has been generated, waiting for user to accept
 * - 'executing': User accepted plan, working through steps
 */
function ChatArea({ layout }) {
  // Get state and functions from context
  const {
    phase,
    messages,
    plan,
    currentStepIndex,
    isLoading,
    addMessage,
    setGeneratedPlan,
    acceptPlan,
    goToStep,
    completeCurrentStep,
    addStepMessage,
    updateThreadTitle,
    setIsLoading,
  } = useChatContext()

  // Get Gemini API functions
  const { createPlan, sendStepMessage, sendChatMessage, isLoading: apiLoading } = useGemini()

  // Ref for scrolling to bottom of messages
  const messagesEndRef = useRef(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, plan?.steps?.[currentStepIndex]?.messages])

  /**
   * Handle sending a message
   * Behavior depends on current phase
   */
  const handleSendMessage = async (content) => {
    if (phase === 'chatting' || phase === 'planning') {
      // Add user message to chat
      addMessage('user', content)

      // Update thread title if this is the first message
      if (messages.length === 0) {
        // Use first ~30 chars of message as title
        const title = content.length > 30 ? content.substring(0, 30) + '...' : content
        updateThreadTitle(title)
      }

      setIsLoading(true)

      // Generate a plan from the user's request
      const generatedPlan = await createPlan(content)

      if (generatedPlan) {
        // Add assistant message acknowledging the request
        addMessage('assistant', "I've created a plan for you. Take a look and let me know if you'd like to use it, modify it, or start over.")
        setGeneratedPlan(generatedPlan)
      } else {
        addMessage('assistant', 'Sorry, I had trouble creating a plan. Please try again.')
      }

      setIsLoading(false)
    } else if (phase === 'executing') {
      // We're in step mode - add message to current step
      addStepMessage('user', content)

      setIsLoading(true)

      // Get AI response for this step
      const currentStep = plan.steps[currentStepIndex]
      const completedSteps = plan.steps.slice(0, currentStepIndex)
      const response = await sendStepMessage(
        content,
        currentStep,
        currentStep.messages,
        completedSteps
      )

      if (response) {
        addStepMessage('assistant', response)
      } else {
        addStepMessage('assistant', 'Sorry, I had trouble responding. Please try again.')
      }

      setIsLoading(false)
    }
  }

  /**
   * Handle "Use Plan" button click
   */
  const handleUsePlan = () => {
    acceptPlan()
  }

  /**
   * Get the messages to display based on current phase
   */
  const getDisplayMessages = () => {
    if (phase === 'executing' && plan) {
      // In executing phase, show only current step's messages
      return plan.steps[currentStepIndex]?.messages || []
    }
    // In chatting/planning phase, show main messages
    return messages
  }

  const displayMessages = getDisplayMessages()
  const currentStep = plan?.steps?.[currentStepIndex]

  return (
    <main className={`chat-area layout-${layout}`}>
      {/* Wrapper for chat content and optional sidebar */}
      <div className="chat-area-wrapper">
        {/* Main chat column */}
        <div className="chat-main">
          {/* Step header for inline layout when executing */}
          {phase === 'executing' && layout === 'inline' && plan && (
            <StepNavInline
              steps={plan.steps}
              currentStepIndex={currentStepIndex}
              onStepClick={goToStep}
              onCompleteStep={completeCurrentStep}
            />
          )}

          {/* Messages area */}
          <div className="messages-container">
            {/* Show messages */}
            {displayMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Show plan artifact in planning phase */}
            {phase === 'planning' && plan && (
              <PlanArtifact
                plan={plan}
                onUsePlan={handleUsePlan}
              />
            )}

            {/* Loading indicator */}
            {(isLoading || apiLoading) && (
              <div className="loading-indicator">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Step footer for inline layout when executing */}
          {phase === 'executing' && layout === 'inline' && plan && (
            <StepNavInlineFooter
              steps={plan.steps}
              currentStepIndex={currentStepIndex}
              onStepClick={goToStep}
              onCompleteStep={completeCurrentStep}
            />
          )}

          {/* Chat input */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={isLoading || apiLoading}
            placeholder={
              phase === 'executing'
                ? `Ask about ${currentStep?.title || 'this step'}...`
                : 'Describe what you want to accomplish...'
            }
          />
        </div>

        {/* Mini sidebar for sidebar layout when executing */}
        {phase === 'executing' && layout === 'sidebar' && plan && (
          <StepNavSidebar
            steps={plan.steps}
            currentStepIndex={currentStepIndex}
            onStepClick={goToStep}
            onCompleteStep={completeCurrentStep}
          />
        )}
      </div>
    </main>
  )
}

export default ChatArea
