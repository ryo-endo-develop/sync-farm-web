import './App.css'

import { Route, Routes } from 'react-router-dom'

import TaskListPage from './components/pages/TaskListPage'

function App() {
  return (
    <Routes>
      {/* Routes using AppLayout */}
      <Route>
        {/* <Route path="/" element={<DashboardPage />} /> */}
        <Route path="/tasks" element={<TaskListPage />} />{' '}
        {/* ★ /tasks ルートを追加 */}
        {/* <Route path="/calendar" element={<CalendarPage />} /> */}
        {/* <Route path="/memos" element={<MemoBoardPage />} /> */}
        {/* <Route path="/settings" element={<SettingsPage />} /> */}
      </Route>

      {/* Routes without AppLayout */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  )
}

export default App
