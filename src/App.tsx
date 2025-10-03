import DashBoard from './pages/Dashboard/DashBoard';
import LandingPage from './pages/LandingPage/LandingPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import ProjectTable from './pages/Project/Projects';
import ProjectBoard from './pages/Project/ProjectBoard';
import SecuredRoutes from './components/SecuredRoutes/SecuredRoutes';
import CreateProject from './pages/Project/createProject';
import UserBoard from './pages/User/UserBoard';
import TeamBoard from './pages/Team/TeamBoard';
import EmailVerification from './pages/Auth/EmailVerification';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import { ProjectIssues } from './pages/Issues/issues';
import ProjectProgress from './pages/Progress/Progress';
import { ProjectSprints } from './pages/Sprint/AllSprints';
import ProjectTimeline from './pages/Timeline/TimeLine';
import ProjectRedirect from './pages/Dashboard/Redirect';
import TeamDetails from './pages/Team/TeamDetails/TeamDetails';
import CreateTeam from './pages/Team/CreateTeam';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/signup" element={<Auth />} />
        <Route path="/signup/verify" element={<EmailVerification />} />

        <Route element={<SecuredRoutes />}>
          <Route path="/projects/create" element={<CreateProject />}></Route>
          <Route element={<DashBoard />}>
            <Route path="/projects" element={<ProjectRedirect />} />
            <Route path="/projects/list" element={<ProjectTable />} />
            <Route path="/projects/:projectId" element={<ProjectBoard />}>
              <Route index element={<Navigate to="sprints" replace />} />
              {/* Tab routes */}
              <Route path="sprints" element={<ProjectSprints />} />
              <Route path="issues" element={<ProjectIssues />} />
              <Route path="progress" element={<ProjectProgress />} />
              <Route path="timeline" element={<ProjectTimeline />} />
            </Route>
            <Route
              path="/projects/:projectId/details"
              element={<ProjectBoard />}
            ></Route>
            <Route path="/people/:userId" element={<UserBoard />}></Route>
            <Route path="/people/:userId/inbox" element={<UserBoard />}></Route>
            <Route path="/people/search" element={<UserBoard />}></Route>
            <Route path="/people/teams" element={<TeamBoard />}></Route>
            <Route path="/people/teams/create" element={<CreateTeam />}></Route>
            <Route
              path="/people/teams/:teamId"
              element={<TeamDetails />}
            ></Route>
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </>
  );
}

export default App;
