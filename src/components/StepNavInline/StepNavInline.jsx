import './StepNavInline.css'

/**
 * StepNavInline Component (Layout A)
 *
 * Shows steps inline with the chat:
 * - Current step title appears above messages (with red dot indicator)
 * - Future steps appear grayed out below the chat, above the input
 *
 * This matches your first mockup layout where "Step One" is at the top
 * and "Step Two", "Step Three" are grayed below the input.
 *
 * PROPS:
 * - steps: array of step objects
 * - currentStepIndex: which step is active (0-indexed)
 * - onStepClick: function(index) - called when a step is clicked
 * - onCompleteStep: function - called when "Complete Step" is clicked
 */
function StepNavInline({ steps, currentStepIndex, onStepClick, onCompleteStep }) {
  if (!steps || steps.length === 0) return null

  const currentStep = steps[currentStepIndex]
  const futureSteps = steps.slice(currentStepIndex + 1)
  const isLastStep = currentStepIndex === steps.length - 1

  return (
    <>
      {/* Current step header - shown above messages */}
      <div className="inline-current-step">
        {/* Red dot indicator for active step */}
        <span className="step-indicator active"></span>
        <span className="step-title">{currentStep.title}</span>
      </div>

      {/* This component returns two parts:
          1. Current step header (above)
          2. Future steps footer (exported separately for flexible placement) */}
    </>
  )
}

/**
 * StepNavInlineFooter Component
 *
 * The footer part showing future steps (grayed out).
 * This is placed between the messages and the input.
 */
export function StepNavInlineFooter({ steps, currentStepIndex, onStepClick, onCompleteStep }) {
  if (!steps || steps.length === 0) return null

  const futureSteps = steps.slice(currentStepIndex + 1)
  const isLastStep = currentStepIndex === steps.length - 1

  return (
    <div className="inline-footer">
      {/* Complete Step button */}
      <button className="complete-step-btn" onClick={onCompleteStep}>
        {isLastStep ? 'Finish' : 'Complete Step'}
      </button>

      {/* Future steps (grayed out) */}
      {futureSteps.length > 0 && (
        <div className="inline-future-steps">
          {futureSteps.map((step, index) => {
            const actualIndex = currentStepIndex + 1 + index
            return (
              <button
                key={step.id || actualIndex}
                className="future-step"
                onClick={() => onStepClick(actualIndex)}
              >
                {step.title}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StepNavInline
