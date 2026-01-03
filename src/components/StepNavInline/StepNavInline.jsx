import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { Circle, CheckCircle2 } from 'lucide-react'

/**
 * StepNavInline Component (Layout A)
 *
 * Shows current step header with red dot indicator.
 */
function StepNavInline({ steps, currentStepIndex, onStepClick }) {
  if (!steps || steps.length === 0) return null

  const currentStep = steps[currentStepIndex]

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
      <Circle className="w-3 h-3 fill-step-active text-step-active" />
      <span className="font-medium text-sm">{currentStep.title}</span>
    </div>
  )
}

/**
 * StepNavInlineFooter Component
 *
 * Shows future steps (grayed out) and complete button.
 */
export function StepNavInlineFooter({ steps, currentStepIndex, onStepClick, onCompleteStep }) {
  if (!steps || steps.length === 0) return null

  const futureSteps = steps.slice(currentStepIndex + 1)
  const isLastStep = currentStepIndex === steps.length - 1

  return (
    <div className="px-4 py-2 border-t border-border">
      <Button size="sm" onClick={onCompleteStep} className="mb-2">
        {isLastStep ? 'Finish' : 'Complete Step'}
      </Button>

      {futureSteps.length > 0 && (
        <div className="flex flex-col gap-1">
          {futureSteps.map((step, index) => {
            const actualIndex = currentStepIndex + 1 + index
            return (
              <button
                key={step.id || actualIndex}
                onClick={() => onStepClick(actualIndex)}
                className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
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
