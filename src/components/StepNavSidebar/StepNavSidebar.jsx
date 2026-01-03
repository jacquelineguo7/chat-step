import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { Check } from 'lucide-react'

/**
 * StepNavSidebar Component (Layout B)
 *
 * Mini sidebar showing all steps with current highlighted.
 */
function StepNavSidebar({ steps, currentStepIndex, onStepClick, onCompleteStep }) {
  if (!steps || steps.length === 0) return null

  const isLastStep = currentStepIndex === steps.length - 1

  return (
    <aside className="flex flex-col w-36 min-w-36 p-3 m-3 ml-0 bg-muted rounded-lg">
      {/* Steps list */}
      <div className="flex flex-col gap-1 flex-1">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex
          const isPending = index > currentStepIndex

          return (
            <button
              key={step.id || index}
              onClick={() => onStepClick(index)}
              className={cn(
                'flex items-center gap-2 text-left text-sm py-1.5 px-2 rounded transition-colors',
                isActive && 'font-medium text-foreground',
                isCompleted && 'text-foreground',
                isPending && 'text-muted-foreground',
                'hover:bg-black/5'
              )}
            >
              {isCompleted && <Check className="w-3 h-3" />}
              <span className={isCompleted ? '' : 'ml-5'}>{step.title}</span>
            </button>
          )
        })}
      </div>

      {/* Complete button */}
      <Button size="sm" onClick={onCompleteStep} className="mt-3 text-xs">
        {isLastStep ? 'Finish' : 'Complete Step'}
      </Button>
    </aside>
  )
}

export default StepNavSidebar
