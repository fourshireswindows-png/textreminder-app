import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabase.js'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Upcoming from './pages/Upcoming.jsx'
import Contacts from './pages/Contacts.jsx'
import MessageLog from './pages/MessageLog.jsx'
import Settings from './pages/Settings.jsx'
import Layout from './components/Layout.jsx'
import AiChat from './components/AiChat.jsx'

// Trade-specific landing pages
import TradePageWindow from './pages/trades/WindowCleaners.jsx'
import TradePagePlumbers from './pages/trades/Plumbers.jsx'
import TradePageElectricians from './pages/trades/Electricians.jsx'
import TradePageHairdressers from './pages/trades/Hairdressers.jsx'
import TradePageGardeners from './pages/trades/Gardeners.jsx'

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc' }}>
      <div style={{ width:32, height:32, border:'3px solid #e9d5ff', borderTopColor:'#a855f7', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
    </div>
  )

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup"      element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />

        {/* Trade landing pages */}
        <Route path="/window-cleaners"  element={<TradePageWindow />} />
        <Route path="/plumbers"         element={<TradePagePlumbers />} />
        <Route path="/electricians"     element={<TradePageElectricians />} />
        <Route path="/hairdressers"     element={<TradePageHairdressers />} />
        <Route path="/gardeners"        element={<TradePageGardeners />} />

        {/* Protected app */}
        <Route path="/" element={<ProtectedRoute user={user}><Layout user={user} /></ProtectedRoute>}>
          <Route path="dashboard"   element={<Dashboard />} />
          <Route path="upcoming"    element={<Upcoming />} />
          <Route path="contacts"    element={<Contacts />} />
          <Route path="log"         element={<MessageLog />} />
          <Route path="settings"    element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* AI chat bubble — shows on all pages */}
      <AiChat />
    </>
  )
}
