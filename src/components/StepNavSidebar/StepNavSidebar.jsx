import './StepNavSidebar.css'

/**
 * StepNavSidebar Component (Layout B)
 *
 * A mini sidebar that appears on the right side of the chat.
 * Shows all steps with the current step highlighted.
 *
 * This matches your second mockup layout with the floating
 * sidebar showing "Step One", "Step Two", "Step Three".
 *
 * PROPS:
 * - steps: array of step objects
 * - currentStepIndex: which step is active (0-indexed)
 * - onStepClick: function(index) - called when a step is clicked
 * - onCompleteStep: function - called when "Complete Step" is clicked
 */
function StepNavSidebar({ steps, currentStepIndex, onStepClick, onCompleteStep }) {
  if (!steps || steps.length === 0) return null

  const isLastStep = currentStepIndex === steps.length - 1

  return (
    <aside className="step-nav-sidebar">
      {/* Steps list */}
      <div className="sidebar-steps">
        {steps.map((step, index) => {
          // Determine the visual state of this step
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex
          const isPending = index > currentStepIndex

          return (
            <button
              key={step.id || index}
              className={`sidebar-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}`}
              onClick={() => onStepClick(index)}
            >
              {step.title}
            </button>
          )
        })}
      </div>

      {/* Complete Step button */}
      <button className="sidebar-complete-btn" onClick={onCompleteStep}>
        {isLastStep ? 'Finish' : 'Complete Step'}
      </button>
    </aside>
  )
}

export default StepNavSidebar
