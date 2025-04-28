// src/routes.tsx
import { RouteConfig } from './types/routes';
import PhoneLogin from './pages/PhoneLogin';
import VerifyCode from './pages/VerifyCode';
import Chat from './pages/Chat';
import SetupProfile from './pages/SetupProfile';
import NotFound from './pages/NotFound';

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <PhoneLogin />,
  },
  {
    path: '/verify',
    element: <VerifyCode />,
  },
  {
    path: '/chat',
    element: <Chat />,
    protected: true,
  },
  {
    path: '/setup-profile',
    element: <SetupProfile />,
    protected: true,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];