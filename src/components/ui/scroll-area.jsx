import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

/**
 * ScrollArea component (simplified version)
 * Provides a scrollable container with consistent styling
 */
const ScrollArea = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative overflow-auto', className)}
    {...props}
  >
    {children}
  </div>
))
ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
