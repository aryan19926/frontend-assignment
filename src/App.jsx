import { useState } from 'react'
import Lottie from 'lottie-react'
import brainAnimation from './brain-animation.json'
import NewAnimation from './NewAnimation'
import './App.css'

function App() {
  const [showAnimation, setShowAnimation] = useState(false)

  if (showAnimation) {
    return <NewAnimation onBack={() => setShowAnimation(false)} />
  }

  return (
    <div className="app-layout">
      {/* Chat Sidebar */}
      <aside className="chat-sidebar">
        {/* Header */}
        <header className="chat-header">
          <div className="logo-group">
            <svg className="logo-icon" viewBox="0 0 32 32" width="28" height="28">
              <path d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z" fill="none" stroke="#4ade80" strokeWidth="2"/>
              <path d="M16 8 L22 12 L22 20 L16 24 L10 20 L10 12 Z" fill="#4ade80" opacity="0.3"/>
              <path d="M16 8 L22 12 L22 20 L16 24 L10 20 L10 12 Z" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
            </svg>
            <span className="logo-text">Realm<span className="logo-bold">labs</span></span>
          </div>
          <div className="header-actions">
            <button className="icon-btn" title="New Chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            <button className="icon-btn" title="Export">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </button>
            <button className="icon-btn" title="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Model Selector */}
        <div className="model-selector-wrapper">
          <div className="model-selector">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span>Meta Llama 3.1</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
            <span>0</span>
          </div>
          <div className="stat-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Default</span>
          </div>
          <div className="stat-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>100</span>
          </div>
          <div className="stat-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Show Special</span>
          </div>
        </div>

        {/* Empty State */}
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3 className="empty-title">No messages yet</h3>
          <p className="empty-subtitle">Start a conversation by typing your message below</p>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Type your message..."
              className="chat-input"
            />
            <button className="send-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Brain Animation */}
      <main className="brain-panel">
        <div className="brain-wrapper">
          <Lottie
            animationData={brainAnimation}
            loop
            autoplay
            className="brain"
          />
        </div>

        {/* View Animation Button */}
        <button className="view-animation-btn" onClick={() => setShowAnimation(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          View 3D Animation
        </button>
      </main>
    </div>
  )
}

export default App
