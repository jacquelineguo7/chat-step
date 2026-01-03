import { useState } from 'react'
import { ChatProvider } from './context/ChatContext'
import TopNavBar from './components/TopNavBar/TopNavBar'
import ChatSidebar from './components/ChatSidebar/ChatSidebar'
import ChatArea from './components/ChatArea/ChatArea'

/**
 * Main App Component
 *
 * Layout structure:
 * - TopNavBar: thin bar at top for switching between layout prototypes
 * - ChatSidebar: left panel showing list of chat threads
 * - ChatArea: main area where chat happens (changes based on selected layout)
 */
function App() {
  // Track which layout prototype is selected: 'inline' or 'sidebar'
  const [activeLayout, setActiveLayout] = useState('inline')

  return (
    <ChatProvider>
      <div className="flex flex-col h-screen w-full bg-background">
        {/* Top navigation bar */}
        <TopNavBar
          activeLayout={activeLayout}
          onLayoutChange={setActiveLayout}
        />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <ChatSidebar />

          {/* Main chat area */}
          <ChatArea layout={activeLayout} />
        </div>
      </div>
    </ChatProvider>
  )
}

export default App
