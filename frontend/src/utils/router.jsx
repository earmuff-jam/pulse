import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../features/Layout/Layout';
import Reports from '../features/Reports/Reports';

const HomePage = lazy(() => import('../features/Home/HomePage'));
const NotesList = lazy(() => import('../features/Notes/NotesList'));
const PlanList = lazy(() => import('../features/Maintenance/PlanList'));
const ProfilePage = lazy(() => import('../features/Profile/ProfilePage'));
const InventoryList = lazy(() => import('../features/InventoryList/InventoryList'));
const EditInventory = lazy(() => import('../features/InventoryList/EditInventory'));
const CategoryList = lazy(() => import('../features/Categories/CategoryList'));
const CategoryItem = lazy(() => import('../features/Categories/CategoryItem'));
const MaintenanceItem = lazy(() => import('../features/Maintenance/MaintenanceItem'));
const RecentActivityList = lazy(() => import('../features/Activities/RecentActivityList'));

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
        element: <CategoryItem />,
      },
      {
        path: '/plans/list',
        element: <PlanList />,
      },
      {
        path: '/plan/:id',
        element: <MaintenanceItem />,
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
