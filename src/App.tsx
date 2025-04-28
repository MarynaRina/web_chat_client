// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { routes } from './routes';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {routes.map(({ path, element, protected: isProtected }) =>
          isProtected ? (
            <Route key={path} element={<PrivateRoute />}>
              <Route path={path} element={element} />
            </Route>
          ) : (
            <Route key={path} path={path} element={element} />
          )
        )}
      </Routes>
    </AuthProvider>
  );
}

export default App;