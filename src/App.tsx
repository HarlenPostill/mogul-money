import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainScreen from './screens/MainScreen'
import HostScreen from './screens/HostScreen'
import PlayerScreen from './screens/PlayerScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The big shared screen everyone watches */}
        <Route path="/" element={<MainScreen />} />
        {/* Host control deck — unlisted, reached by typing the URL */}
        <Route path="/host" element={<HostScreen />} />
        {/* Contestant phones — this is what the lobby QR code points at */}
        <Route path="/play" element={<PlayerScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
