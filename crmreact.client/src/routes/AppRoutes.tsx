import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardView } from '../pages/dashboard/views/DashboardView.tsx';
import { AccountsList } from '../pages/accounts/views/AccountsList.tsx';
import { AccountEdit } from '../pages/accounts/views/AccountEdit.tsx';
import { ContactsList } from '../pages/contacts/views/ContactsList.tsx';
import { ContactEdit } from '../pages/contacts/views/ContactEdit.tsx';
import { TicketsList } from '../pages/tickets/views/TicketsList.tsx';
import { TicketEdit } from '../pages/tickets/views/TicketEdit.tsx';
import { APP_ROUTES } from './paths.ts';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Dashboard */}
            <Route path={APP_ROUTES.HOME} element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
            <Route path={APP_ROUTES.DASHBOARD} element={<DashboardView />} />

            {/* Accounts */}
            <Route path={APP_ROUTES.ACCOUNTS} element={<AccountsList showEditing={true} />} />
            <Route path={APP_ROUTES.ACCOUNT_EDIT} element={<AccountEdit />} />

            {/* Contacts */}
            <Route path={APP_ROUTES.CONTACTS} element={<ContactsList showEditing={true} />} />
            <Route path={APP_ROUTES.CONTACT_EDIT} element={<ContactEdit />} />

            {/* Tickets */}
            <Route path={APP_ROUTES.TICKETS} element={<TicketsList showEditing={true} />} />
            <Route path={APP_ROUTES.TICKET_EDIT} element={<TicketEdit />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
        </Routes>
    );
};

export default AppRoutes;
