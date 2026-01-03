import { useState } from 'react'
import { ChatProvider } from './context/ChatContext'
import TopNavBar from './components/TopNavBar/TopNavBar'
import ChatSidebar from './components/ChatSidebar/ChatSidebar'
import ChatArea from './components/ChatArea/ChatArea'

/**
 * Main App Component
 *
 * This is the root component that brings everything together:
 * - TopNavBar: The thin bar at top for switching between layout prototypes
 * - ChatSidebar: Left panel showing list of chat threads
 * - ChatArea: Main area where chat happens (changes based on selected layout)
 */
function App() {
  // Track which layout prototype is selected: 'inline' or 'sidebar'
  // 'inline' = Layout A (steps appear inline with chat)
  // 'sidebar' = Layout B (steps appear in mini sidebar on right)
  const [activeLayout, setActiveLayout] = useState('inline')

  return (
    // ChatProvider wraps everything to share state across components
    <ChatProvider>
      <div className="app">
        {/* Top navigation bar for switching between prototype layouts */}
        <TopNavBar
          activeLayout={activeLayout}
          onLayoutChange={setActiveLayout}
        />

        {/* Main content area with sidebar and chat */}
        <div className="app-content">
          {/* Left sidebar showing chat threads */}
          <ChatSidebar />

          {/* Main chat area - receives which layout to use */}
          <ChatArea layout={activeLayout} />
        </div>
      </div>
    </ChatProvider>
  )
}

export default App
