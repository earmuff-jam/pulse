import { lazy } from 'react';

import { createBrowserRouter } from 'react-router-dom';

import Layout from '@features/Layout/Layout'; // can't lazy load this

const HomePage = lazy(() => import('@features/Home/HomePage'));
const Reports = lazy(() => import('@features/Reports/Reports'));
const NotesList = lazy(() => import('@features/Notes/NotesList'));

const ProfilePage = lazy(() => import('@features/Profile/ProfilePage'));
const CategoryList = lazy(() => import('@features/Categories/CategoryList'));
const InventoryList = lazy(() => import('@features/InventoryList/InventoryList'));
const RecentActivityList = lazy(() => import('@features/RecentActivities/RecentActivityList'));

const EditInventory = lazy(() => import('@features/InventoryList/EditInventory/EditInventory'));
const MaintenancePlanList = lazy(() => import('@features/MaintenancePlanList/MaintenancePlanList'));
const CategoryItemDetails = lazy(() => import('@features/CategoryItemDetails/CategoryItemDetails'));

const MaintenancePlanItemDetails = lazy(() =>
  import('@features/MaintenancePlanItemDetails/MaintenancePlanItemDetails')
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/inventories/list',
        element: <InventoryList />,
      },
      {
        path: '/inventories/:id/update',
        element: <EditInventory />,
      },
      {
        path: '/categories/list',
        element: <CategoryList />,
      },
      {
        path: '/category/:id',
        element: <CategoryItemDetails />,
      },
      {
        path: '/plans/list',
        element: <MaintenancePlanList />,
      },
      {
        path: '/plan/:id',
        element: <MaintenancePlanItemDetails />,
      },
      {
        path: '/reports',
        element: <Reports />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/profile/notes',
        element: <NotesList />,
      },
      {
        path: 'recent/activities',
        element: <RecentActivityList />,
      },
    ],
  },
]);
