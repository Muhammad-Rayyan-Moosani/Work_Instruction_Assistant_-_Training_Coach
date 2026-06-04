import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login              from './Pages/Login/Login.jsx'
import Assistant          from './Pages/Assistant/Assistant.jsx'
import DocumentSearch     from './Pages/DocumentSearch/DocumentSearch.jsx'
import DocumentManagement from './Pages/DocumentManagement/DocumentManagement.jsx'
import UserManagement     from './Pages/UserManagement/UserManagement.jsx'
import TeamManagement     from './Pages/TeamManagement/TeamManagement.jsx'
import AccessControl      from './Pages/AccessControl/AccessControl.jsx'
import AdminSettings      from './Pages/AdminSettings/AdminSettings.jsx'
import UsageDashboard     from './Pages/UsageDashboard/UsageDashboard.jsx'
import QuizBuilder        from './Pages/QuizBuilder/QuizBuilder.jsx'
import TakeQuiz           from './Pages/TakeQuiz/TakeQuiz.jsx'
import QuizResults        from './Pages/QuizResults/QuizResults.jsx'
import ProtectRoute       from './components/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>

  
        <Route path="/" element={<Login />} />


        <Route path="/assistant" element={
          <ProtectRoute allowedRoles={['Administrator', 'Operator', 'Supervisor']}>
            <Assistant />
          </ProtectRoute>
        } />
        <Route path="/documents/search" element={
          <ProtectRoute>
            <DocumentSearch />
          </ProtectRoute>
        } />
        <Route path="/quiz/take" element={
          <ProtectRoute>
            <TakeQuiz />
          </ProtectRoute>
        } />

        {/* Admin only */}
        <Route path="/users" element={
          <ProtectRoute allowedRoles={['Administrator']}>
            <UserManagement />
          </ProtectRoute>
        } />
        <Route path="/teams" element={
          <ProtectRoute allowedRoles={['Administrator']}>
            <TeamManagement />
          </ProtectRoute>
        } />
        <Route path="/documents/manage" element={
          <ProtectRoute allowedRoles={['Administrator']}>
            <DocumentManagement />
          </ProtectRoute>
        } />
        <Route path="/access-control" element={
          <ProtectRoute allowedRoles={['Administrator']}>
            <AccessControl />
          </ProtectRoute>
        } />
        <Route path="/settings" element={
          <ProtectRoute allowedRoles={['Administrator']}>
            <AdminSettings />
          </ProtectRoute>
        } />

        {/* Admin + Supervisor */}
        <Route path="/quiz/builder" element={
          <ProtectRoute allowedRoles={['Administrator', 'Supervisor']}>
            <QuizBuilder />
          </ProtectRoute>
        } />

        {/* Admin + Supervisor + Executive Viewer */}
        <Route path="/dashboard" element={
          <ProtectRoute allowedRoles={['Administrator', 'Supervisor', 'Executive Viewer']}>
            <UsageDashboard />
          </ProtectRoute>
        } />
        <Route path="/quiz/results" element={
          <ProtectRoute allowedRoles={['Administrator', 'Supervisor', 'Executive Viewer']}>
            <QuizResults />
          </ProtectRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App
