import { useState } from 'react'
import './ChatInput.css'

/**
 * ChatInput Component
 *
 * The text input field at the bottom of the chat.
 * Users type their messages here and press Enter or click Send.
 *
 * PROPS:
 * - onSend: function(message) - called when user submits a message
 * - disabled: boolean - when true, input is disabled (e.g., while loading)
 * - placeholder: string - placeholder text in the input
 */
function ChatInput({ onSend, disabled = false, placeholder = 'Type a message...' }) {
  // Track what the user is typing
  const [inputValue, setInputValue] = useState('')

  /**
   * Handle form submission (Enter key or button click)
   */
  const handleSubmit = (e) => {
    e.preventDefault() // Prevent page refresh

    // Don't submit empty messages
    const trimmedValue = inputValue.trim()
    if (!trimmedValue || disabled) return

    // Call the onSend function with the message
    onSend(trimmedValue)

    // Clear the input
    setInputValue('')
  }

  /**
   * Handle Enter key press
   * Submit on Enter, but allow Shift+Enter for new lines
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />
      {/* Send button - could be added later if needed */}
    </form>
  )
}

export default ChatInput
