import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

/**
 * ChatInput Component
 *
 * Text input field at the bottom of the chat.
 */
function ChatInput({ onSend, disabled = false, placeholder = 'Type a message...' }) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedValue = inputValue.trim()
    if (!trimmedValue || disabled) return
    onSend(trimmedValue)
    setInputValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-muted border-0"
        />
        <Button type="submit" size="icon" disabled={disabled || !inputValue.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}

export default ChatInput
