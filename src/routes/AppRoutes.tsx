import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import {
  chatbubbleEllipses,
  home,
  people,
  briefcase,
  search,
  settings,
  documentText,
  personCircle,
} from 'ionicons/icons';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useCompanyAuth } from '../hooks/useCompanyAuth';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ChatPage from '../pages/chat/ChatPage';
import ConversationsPage from '../pages/chat/ConversationsPage';
import ConnectionsPage from '../pages/connections/ConnectionsPage';
import DeveloperDetailPage from '../pages/developers/DeveloperDetailPage';
import DeveloperListPage from '../pages/developers/DeveloperListPage';
import JobCategorySelectPage from '../pages/jobs/JobCategorySelectPage';
import JobDetailPage from '../pages/jobs/JobDetailPage';
import JobLevelSelectPage from '../pages/jobs/JobLevelSelectPage';
import JobsListPage from '../pages/jobs/JobsListPage';
import MyApplicationsPage from '../pages/jobs/MyApplicationsPage';
import CreateMeetingPage from '../pages/meetings/CreateMeetingPage';
import MeetingsPage from '../pages/meetings/MeetingsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import OnboardingPage from '../pages/onboarding/OnboardingPage';
import CreateProfilePage from '../pages/profile/CreateProfilePage';
import EditProfilePage from '../pages/profile/EditProfilePage';
import MyProfilePage from '../pages/profile/MyProfilePage';
import ReceivedRequestsPage from '../pages/requests/ReceivedRequestsPage';
import SentRequestsPage from '../pages/requests/SentRequestsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import TelegramSettingsPage from '../pages/settings/TelegramSettingsPage';
import CompanyApplicationDetailPage from '../pages/company/CompanyApplicationDetailPage';
import CompanyApplicationsPage from '../pages/company/CompanyApplicationsPage';
import CompanyJobDetailPage from '../pages/company/CompanyJobDetailPage';
import CompanyJobFormPage from '../pages/company/CompanyJobFormPage';
import CompanyJobsPage from '../pages/company/CompanyJobsPage';
import CompanyProfilePage from '../pages/company/CompanyProfilePage';
import { hapticLight } from '../utils/haptics';

// ── Developer tab layout ────────────────────────────────────────────────────
const DevTabsLayout: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet animated>
      <Route exact path="/tabs/home" component={MyProfilePage} />
      <Route exact path="/tabs/discover" component={DeveloperListPage} />
      <Route exact path="/tabs/jobs" component={JobCategorySelectPage} />
      <Route exact path="/tabs/connections" component={ConnectionsPage} />
      <Route exact path="/tabs/chat" component={ConversationsPage} />
      <Route exact path="/tabs/settings" component={SettingsPage} />
      <Route exact path="/tabs">
        <Redirect to="/tabs/home" />
      </Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom" className="dc-tab-bar">
      <IonTabButton tab="home" href="/tabs/home" onClick={() => hapticLight()}>
        <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="discover" href="/tabs/discover" onClick={() => hapticLight()}>
        <IonIcon icon={search} />
        <IonLabel>Discover</IonLabel>
      </IonTabButton>
      <IonTabButton tab="jobs" href="/tabs/jobs" onClick={() => hapticLight()}>
        <IonIcon icon={briefcase} />
        <IonLabel>Jobs</IonLabel>
      </IonTabButton>
      <IonTabButton tab="connections" href="/tabs/connections" onClick={() => hapticLight()}>
        <IonIcon icon={people} />
        <IonLabel>Connect</IonLabel>
      </IonTabButton>
      <IonTabButton tab="chat" href="/tabs/chat" onClick={() => hapticLight()}>
        <IonIcon icon={chatbubbleEllipses} />
        <IonLabel>Chat</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings" href="/tabs/settings" onClick={() => hapticLight()}>
        <IonIcon icon={settings} />
        <IonLabel>Settings</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

// ── Company tab layout ──────────────────────────────────────────────────────
const CompanyTabsLayout: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet animated>
      <Route exact path="/company/tabs/jobs" component={CompanyJobsPage} />
      <Route exact path="/company/tabs/applications" component={CompanyApplicationsPage} />
      <Route exact path="/company/tabs/profile" component={CompanyProfilePage} />
      <Route exact path="/company/tabs">
        <Redirect to="/company/tabs/jobs" />
      </Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom" className="dc-tab-bar">
      <IonTabButton tab="company-jobs" href="/company/tabs/jobs" onClick={() => hapticLight()}>
        <IonIcon icon={briefcase} />
        <IonLabel>Jobs</IonLabel>
      </IonTabButton>
      <IonTabButton tab="company-apps" href="/company/tabs/applications" onClick={() => hapticLight()}>
        <IonIcon icon={documentText} />
        <IonLabel>Applications</IonLabel>
      </IonTabButton>
      <IonTabButton tab="company-profile" href="/company/tabs/profile" onClick={() => hapticLight()}>
        <IonIcon icon={personCircle} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

// ── Root router ─────────────────────────────────────────────────────────────
const AppRoutes: React.FC = () => {
  const { isAuthenticated: isDevAuth, isLoading: devLoading } = useAuth();
  const { isAuthenticated: isCompanyAuth, isLoading: companyLoading } = useCompanyAuth();

  if (devLoading || companyLoading) {
    return <LoadingSpinner label="Starting DevCollab..." />;
  }

  return (
    <IonRouterOutlet animated>
      <Switch>
        {/* ── Auth ── */}
        <Route
          exact
          path="/login"
          render={() => {
            if (isCompanyAuth) return <Redirect to="/company/tabs/jobs" />;
            if (isDevAuth) return <Redirect to="/tabs/home" />;
            return <LoginPage />;
          }}
        />
        <Route
          exact
          path="/register"
          render={() => (isDevAuth ? <Redirect to="/tabs/home" /> : <RegisterPage />)}
        />

        {/* ── Company portal ── */}
        <Route exact path="/company/jobs/create" component={CompanyJobFormPage} />
        <Route exact path="/company/jobs/:id/edit" component={CompanyJobFormPage} />
        <Route exact path="/company/jobs/:id" component={CompanyJobDetailPage} />
        <Route exact path="/company/applications/:id" component={CompanyApplicationDetailPage} />
        <Route
          path="/company/tabs"
          render={() => (isCompanyAuth ? <CompanyTabsLayout /> : <Redirect to="/login" />)}
        />
        <Route exact path="/company">
          <Redirect to={isCompanyAuth ? '/company/tabs/jobs' : '/login'} />
        </Route>

        {/* ── Developer app ── */}
        <ProtectedRoute exact path="/onboarding" component={OnboardingPage} />
        <ProtectedRoute exact path="/profile/create" component={CreateProfilePage} />
        <ProtectedRoute exact path="/profile/edit" component={EditProfilePage} />
        <ProtectedRoute exact path="/developers/:id" component={DeveloperDetailPage} />
        <ProtectedRoute exact path="/jobs/applications/me" component={MyApplicationsPage} />
        <ProtectedRoute exact path="/jobs/level/:categoryId" component={JobLevelSelectPage} />
        <ProtectedRoute exact path="/jobs/results/:categoryId/:level" component={JobsListPage} />
        <ProtectedRoute exact path="/jobs/:id" component={JobDetailPage} />
        <ProtectedRoute exact path="/chat/:conversationId" component={ChatPage} />
        <ProtectedRoute exact path="/requests/received" component={ReceivedRequestsPage} />
        <ProtectedRoute exact path="/requests/sent" component={SentRequestsPage} />
        <ProtectedRoute exact path="/meetings" component={MeetingsPage} />
        <ProtectedRoute exact path="/meetings/create" component={CreateMeetingPage} />
        <ProtectedRoute exact path="/notifications" component={NotificationsPage} />
        <ProtectedRoute exact path="/settings/telegram" component={TelegramSettingsPage} />
        <ProtectedRoute path="/tabs" component={DevTabsLayout} />

        {/* ── Root redirect ── */}
        <Route exact path="/">
          <Redirect to={isCompanyAuth ? '/company/tabs/jobs' : isDevAuth ? '/tabs/home' : '/login'} />
        </Route>
        <Route>
          <Redirect to={isCompanyAuth ? '/company/tabs/jobs' : isDevAuth ? '/tabs/home' : '/login'} />
        </Route>
      </Switch>
    </IonRouterOutlet>
  );
};

export default AppRoutes;
