import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { Homepage } from './components/Homepage/Homepage'
import { HistoryPage } from './components/HistoryPage/HistoryPage'
import { GeneratePage } from './components/GeneratePage/GeneratePage'

function App() {
  return (
    <BrowserRouter>
      {' '}
      {/* ← Оберните всё в BrowserRouter */}
      <div style={{ padding: '40px' }}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/generatePage" element={<GeneratePage />} />
          <Route path="/historyPage" element={<HistoryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
