import { Outlet, Route, Routes } from 'react-router-dom'

import TaskListPage from './components/pages/TaskListPage'
import { AppLayout } from './components/templates/AppLayout'

function App() {
  return (
    <Routes>
      {/* ★ AppLayout を適用するルートグループ */}
      <Route
        path="/" // このレイアウトを使うルートのベースパス (必要なら)
        element={
          // ★ element Prop にレイアウトコンポーネントを指定
          <AppLayout>
            {/* ★ Outlet は子ルートのコンポーネントがレンダリングされる場所 */}
            <Outlet />
          </AppLayout>
        }
      >
        {/* --- ここに AppLayout を使うページルートをネストさせる --- */}
        {/* '/' にアクセスした場合、AppLayout 内の Outlet に DashboardPage が表示される */}
        {/* <Route index element={<DashboardPage />} /> */}
        {/* '/tasks' にアクセスした場合、AppLayout 内の Outlet に TaskListPage が表示される */}
        <Route path="tasks" element={<TaskListPage />} />
        {/* 他のページも同様に追加 */}
        {/* <Route path="calendar" element={<CalendarPage />} /> */}
        {/* <Route path="memos" element={<MemoBoardPage />} /> */}
        {/* <Route path="settings" element={<SettingsPage />} /> */}
      </Route>

      {/* --- AppLayout を使わないルート (例: ログインページなど) --- */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  )
}

export default App
