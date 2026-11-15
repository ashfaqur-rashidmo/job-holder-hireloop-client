import React from 'react';
import { requireRole } from '@/lib/core/server';

const RecruiterDashboardLayout = async ({children} : {children: React.ReactNode}) => {
    await requireRole("recruiter");
    return children;
};

export default RecruiterDashboardLayout;