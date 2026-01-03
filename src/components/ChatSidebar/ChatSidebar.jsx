import { useChatContext } from '../../context/ChatContext'
import './ChatSidebar.css'

/**
 * ChatSidebar Component
 *
 * The left sidebar showing all chat threads.
 * This matches the "Chats" panel in your mockups with:
 * - "Chats" header
 * - List of chat threads
 * - Currently selected thread is highlighted
 *
 * It uses the ChatContext to:
 * - Get the list of threads
 * - Know which thread is selected
 * - Select a different thread
 * - Create a new thread
 */
function ChatSidebar() {
  // Get data and functions from our context
  const {
    threads,           // Array of all chat threads
    currentThreadId,   // ID of the currently selected thread
    selectThread,      // Function to select a thread
    createThread,      // Function to create a new thread
  } = useChatContext()

  return (
    <aside className="chat-sidebar">
      {/* Header with "Chats" label */}
      <div className="sidebar-header">
        <h2 className="sidebar-title">Chats</h2>
      </div>

      {/* List of chat threads */}
      <div className="thread-list">
        {threads.map((thread) => (
          <button
            key={thread.id}
            className={`thread-item ${thread.id === currentThreadId ? 'active' : ''}`}
            onClick={() => selectThread(thread.id)}
          >
            {/* Thread title */}
            <span className="thread-title">{thread.title}</span>
          </button>
        ))}
      </div>

      {/* New chat button at the bottom */}
      <button className="new-chat-button" onClick={createThread}>
        + New Chat
      </button>
    </aside>
  )
}

export default ChatSidebar
