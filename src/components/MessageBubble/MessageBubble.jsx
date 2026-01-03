import './MessageBubble.css'

/**
 * MessageBubble Component
 *
 * Displays a single chat message.
 * User messages appear on the right, assistant messages on the left.
 *
 * PROPS:
 * - message: object with { role: 'user' | 'assistant', content: string }
 *
 * STYLING:
 * - User messages: right-aligned, gray background
 * - Assistant messages: left-aligned, gray background (wider)
 */
function MessageBubble({ message }) {
  // Determine if this is a user or assistant message
  const isUser = message.role === 'user'

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-content">
        {message.content}
      </div>
    </div>
  )
}

export default MessageBubble
