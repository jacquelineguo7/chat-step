import './PlanArtifact.css'

/**
 * PlanArtifact Component
 *
 * Displays the generated step-by-step plan in a bordered box.
 * This matches the "Plan Artifact" box in your mockups with:
 * - Title at the top
 * - Numbered steps with sub-parts
 * - Action buttons at the bottom (Use Plan, Modify, Scrap)
 *
 * PROPS:
 * - plan: object with { title, steps: [{ title, description, subParts }] }
 * - onUsePlan: function - called when user clicks "Use Plan"
 * - onModify: function - called when user clicks "Modify" (optional)
 * - onScrap: function - called when user clicks "Scrap" (optional)
 */
function PlanArtifact({ plan, onUsePlan, onModify, onScrap }) {
  if (!plan) return null

  return (
    <div className="plan-artifact">
      {/* Plan header/title */}
      <div className="plan-header">
        <span className="plan-label">Plan Artifact</span>
      </div>

      {/* Steps list */}
      <ol className="plan-steps">
        {plan.steps.map((step, index) => (
          <li key={step.id || index} className="plan-step">
            {/* Step title */}
            <span className="step-title">{step.title}</span>

            {/* Sub-parts (if any) */}
            {step.subParts && step.subParts.length > 0 && (
              <ol className="step-subparts" type="a">
                {step.subParts.map((subPart, subIndex) => (
                  <li key={subIndex} className="step-subpart">
                    {subPart}
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>

      {/* Status text */}
      <div className="plan-status">
        Plan Artifact Created
      </div>

      {/* Action prompt */}
      <div className="plan-actions-prompt">
        Use Plan? Modify? Scrap and Redo?
      </div>

      {/* Action buttons */}
      <div className="plan-actions">
        <button className="plan-action-btn primary" onClick={onUsePlan}>
          Use Plan
        </button>
        {onModify && (
          <button className="plan-action-btn" onClick={onModify}>
            Modify
          </button>
        )}
        {onScrap && (
          <button className="plan-action-btn" onClick={onScrap}>
            Scrap
          </button>
        )}
      </div>
    </div>
  )
}

export default PlanArtifact
