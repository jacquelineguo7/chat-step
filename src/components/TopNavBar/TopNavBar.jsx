import './TopNavBar.css'

/**
 * TopNavBar Component
 *
 * This is the thin navigation bar at the very top of the app.
 * It lets you switch between different layout prototypes.
 *
 * PROPS:
 * - activeLayout: 'inline' | 'sidebar' - which layout is currently selected
 * - onLayoutChange: function - called when user clicks a different layout tab
 *
 * WHAT IT RENDERS:
 * - "Prototypes" label on the left
 * - Tab buttons for each layout variant
 */
function TopNavBar({ activeLayout, onLayoutChange }) {
  // Define the layout options
  // Each has an id (used in code) and a label (shown to user)
  const layouts = [
    { id: 'inline', label: 'Idea 1' },   // Layout A: steps inline with chat
    { id: 'sidebar', label: 'Idea 2' },  // Layout B: mini sidebar on right
  ]

  return (
    <nav className="top-nav-bar">
      {/* Label on the left */}
      <span className="top-nav-label">Prototypes</span>

      {/* Layout tabs */}
      <div className="top-nav-tabs">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            className={`top-nav-tab ${activeLayout === layout.id ? 'active' : ''}`}
            onClick={() => onLayoutChange(layout.id)}
          >
            {layout.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default TopNavBar
