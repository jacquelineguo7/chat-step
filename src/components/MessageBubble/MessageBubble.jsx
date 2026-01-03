import { cn } from '../../lib/utils'

/**
 * MessageBubble Component
 *
 * Displays a single chat message.
 * User messages appear on the right, assistant messages on the left.
 */
function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'px-4 py-3 rounded-lg text-sm whitespace-pre-wrap',
          isUser
            ? 'bg-muted max-w-[50%]'
            : 'bg-muted max-w-[70%]'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

export default MessageBubble
