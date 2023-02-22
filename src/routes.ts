import { RouteType } from '@multiversx/sdk-dapp/types';
import { dAppName } from 'config';
import { withPageTitle } from './components/PageTitle';

import { Dashboard, Home, Statistics } from './pages';
import Shop from './pages/Shop';

export const routeNames = {
  home: '/',
  dashboard: '/dashboard',
  statistics: '/statistics',
  unlock: '/unlock',
  shop: '/shop'
};

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.statistics,
    title: 'Statistics',
    component: Statistics,
    authenticatedRoute: true
  },
  {
    path: routeNames.dashboard,
    title: 'Dashboard',
    component: Dashboard,
    authenticatedRoute: true
    },
    {
        path: routeNames.shop,
        title: 'Shop',
        component: Shop
    }
];

export const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • MultiversX ${dAppName}`
    : `MultiversX ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});
