import { useRef, useEffect } from 'react'
import { useChatContext } from '../../context/ChatContext'
import { useGemini } from '../../hooks/useGemini'
import MessageBubble from '../MessageBubble/MessageBubble'
import ChatInput from '../ChatInput/ChatInput'
import PlanArtifact from '../PlanArtifact/PlanArtifact'
import StepNavInline, { StepNavInlineFooter } from '../StepNavInline/StepNavInline'
import StepNavSidebar from '../StepNavSidebar/StepNavSidebar'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../../lib/utils'
import { Circle, Loader2 } from 'lucide-react'

/**
 * ChatArea Component
 *
 * REDESIGNED: The step-by-step interface is now an EXTENSION of the main chat,
 * not a replacement. When executing a plan:
 * - Main chat thread (with plan) remains visible and scrollable above
 * - Current step appears as a continuation below with its own messages
 * - This creates a unified thread experience
 */
function ChatArea({ layout }) {
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

  const { createPlan, sendStepMessage, isLoading: apiLoading } = useGemini()
  const messagesEndRef = useRef(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, plan?.steps?.[currentStepIndex]?.messages])

  const handleSendMessage = async (content) => {
    if (phase === 'chatting' || phase === 'planning') {
      addMessage('user', content)

      if (messages.length === 0) {
        const title = content.length > 30 ? content.substring(0, 30) + '...' : content
        updateThreadTitle(title)
      }

      setIsLoading(true)
      const generatedPlan = await createPlan(content)

      if (generatedPlan) {
        addMessage('assistant', "I've created a plan for you. Take a look and let me know if you'd like to use it, modify it, or start over.")
        setGeneratedPlan(generatedPlan)
      } else {
        addMessage('assistant', 'Sorry, I had trouble creating a plan. Please try again.')
      }

      setIsLoading(false)
    } else if (phase === 'executing') {
      addStepMessage('user', content)
      setIsLoading(true)

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

  const handleUsePlan = () => {
    acceptPlan()
  }

  const currentStep = plan?.steps?.[currentStepIndex]
  const currentStepMessages = currentStep?.messages || []
  const loading = isLoading || apiLoading

  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex">
        {/* Main chat column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Step header for inline layout */}
          {phase === 'executing' && layout === 'inline' && plan && (
            <StepNavInline
              steps={plan.steps}
              currentStepIndex={currentStepIndex}
              onStepClick={goToStep}
            />
          )}

          {/* Messages area - shows BOTH main chat AND step messages as one thread */}
          <ScrollArea className="flex-1 p-4">
            {/* Main chat messages - always visible */}
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Plan artifact - shown in planning phase or when executing */}
            {(phase === 'planning' || phase === 'executing') && plan && (
              <div className="mb-4">
                <PlanArtifact
                  plan={plan}
                  onUsePlan={phase === 'planning' ? handleUsePlan : undefined}
                />
              </div>
            )}

            {/* Step section header - visual separator when in executing phase */}
            {phase === 'executing' && plan && (
              <div className="my-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Circle className="w-2.5 h-2.5 fill-step-active text-step-active" />
                  <span className="text-sm font-medium">{currentStep?.title}</span>
                  {currentStep?.description && (
                    <span className="text-xs text-muted-foreground">
                      — {currentStep.description}
                    </span>
                  )}
                </div>

                {/* Step messages */}
                {currentStepMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Step footer for inline layout */}
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
            disabled={loading}
            placeholder={
              phase === 'executing'
                ? `Ask about ${currentStep?.title || 'this step'}...`
                : 'Describe what you want to accomplish...'
            }
          />
        </div>

        {/* Mini sidebar for sidebar layout */}
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
