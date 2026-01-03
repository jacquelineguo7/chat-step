import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'

/**
 * PlanArtifact Component
 *
 * Displays the generated step-by-step plan in a bordered card.
 */
function PlanArtifact({ plan, onUsePlan, onModify, onScrap }) {
  if (!plan) return null

  return (
    <Card className="max-w-sm border-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Plan Artifact</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Steps list */}
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {plan.steps.map((step, index) => (
            <li key={step.id || index}>
              <span>{step.title}</span>
              {step.subParts && step.subParts.length > 0 && (
                <ol className="list-[lower-alpha] list-inside ml-4 mt-1 space-y-0.5 text-muted-foreground">
                  {step.subParts.map((subPart, subIndex) => (
                    <li key={subIndex} className="text-xs">{subPart}</li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>

        {/* Status */}
        <p className="mt-4 text-sm">Plan Artifact Created</p>
        <p className="text-xs text-muted-foreground">Use Plan? Modify? Scrap and Redo?</p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button size="sm" onClick={onUsePlan}>
          Use Plan
        </Button>
        {onModify && (
          <Button size="sm" variant="outline" onClick={onModify}>
            Modify
          </Button>
        )}
        {onScrap && (
          <Button size="sm" variant="outline" onClick={onScrap}>
            Scrap
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default PlanArtifact
