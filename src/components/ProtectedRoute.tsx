import React from 'react';
import { Redirect, Route, type RouteProps } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps>;
}

interface RouteComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoading) {
          return <LoadingSpinner label="Checking session..." />;
        }
        if (!isAuthenticated) {
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
