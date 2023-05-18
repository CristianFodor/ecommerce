import {RouteType} from '@multiversx/sdk-dapp/types';
import {dAppName} from 'config';
import {withPageTitle} from './components/PageTitle';

import {Dashboard, Home, Statistics, Shop} from './pages';
import ProductsList from "./pages/Products/ProductsList";
import UserOrderList from "./pages/Orders/UserOrderList";
import AdminOrderList from "./pages/Orders/AdminOrderList";
import CreateProduct from "./pages/Products/CreateProduct";
import EditProduct from "./pages/Products/EditProduct";

export const routeNames = {
    home: '/home',
    dashboard: '/dashboard',
    statistics: '/statistics',
    unlock: '/unlock',
    productList: '/admin/products',
    orderList: '/admin/orders',
    userOrders: '/user/my-orders',
    shop: '/',
    createProduct: '/admin/products/create',
    editProduct: '/admin/products/edit/'
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
        component: Shop,
        authenticatedRoute: false
    },
    {
        path: routeNames.productList,
        title: 'Product Lists',
        component: ProductsList,
        authenticatedRoute: true
    },
    {
        path: routeNames.userOrders,
        title: 'My Orders Lists',
        component: UserOrderList,
        authenticatedRoute: true
    },
    {
        path: routeNames.orderList,
        title: 'Admin Orders Lists',
        component: AdminOrderList,
        authenticatedRoute: true
    },
    {
        path: routeNames.createProduct,
        title: 'Creat Product',
        component: CreateProduct,
        authenticatedRoute: true
    },
    {
        path: routeNames.editProduct + ':productId',
        title: 'Edit Product',
        component: EditProduct,
        authenticatedRoute: true
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
