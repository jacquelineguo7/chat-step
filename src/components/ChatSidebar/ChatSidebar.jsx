import { useChatContext } from '../../context/ChatContext'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../../lib/utils'
import { Plus } from 'lucide-react'

/**
 * ChatSidebar Component
 *
 * Left sidebar showing all chat threads.
 */
function ChatSidebar() {
  const {
    threads,
    currentThreadId,
    selectThread,
    createThread,
  } = useChatContext()

  return (
    <aside className="flex flex-col w-56 min-w-56 h-full bg-sidebar p-4">
      {/* Header */}
      <h2 className="text-sm font-medium mb-3">Chats</h2>

      {/* Thread list */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => selectThread(thread.id)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm rounded-md transition-colors truncate',
                thread.id === currentThreadId
                  ? 'bg-black/15 text-foreground'
                  : 'text-foreground hover:bg-black/5'
              )}
            >
              {thread.title}
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* New chat button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={createThread}
        className="mt-3 w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Chat
      </Button>
    </aside>
  )
}

export default ChatSidebar
