import { cn } from '../../lib/utils'

/**
 * TopNavBar Component
 *
 * Thin navigation bar at the top for switching between layout prototypes.
 * Uses pill-style tabs matching your mockup design.
 */
function TopNavBar({ activeLayout, onLayoutChange }) {
  const layouts = [
    { id: 'inline', label: 'Idea 1' },
    { id: 'sidebar', label: 'Idea 2' },
  ]

  return (
    <nav className="flex items-center gap-6 h-12 px-6 bg-sidebar border-b border-border">
      {/* Label */}
      <span className="font-medium text-sm text-foreground">Prototypes</span>

      {/* Layout tabs */}
      <div className="flex gap-2">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
            className={cn(
              'px-3 py-1 text-sm rounded-full transition-all',
              activeLayout === layout.id
                ? 'border border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
            )}
          >
            {layout.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default TopNavBar
