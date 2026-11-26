import type { Department } from './types';

let departments: Department[] = [
    {
        id: 'DEPT-001',
        name: 'Engineering',
        description: 'Builds and maintains the platform, APIs, and internal tooling.',
        head: 'Olivia Martin',
        memberCount: 24,
        createdAt: 'Mar 2023',
    },
    {
        id: 'DEPT-002',
        name: 'Design',
        description: 'Owns product design, research, and the shared design system.',
        head: 'Isabella Nguyen',
        memberCount: 8,
        createdAt: 'Mar 2023',
    },
    {
        id: 'DEPT-003',
        name: 'Sales',
        description: 'Grows revenue through new business and account expansion.',
        head: 'Emma Davis',
        memberCount: 16,
        createdAt: 'Apr 2023',
    },
    {
        id: 'DEPT-004',
        name: 'Analytics',
        description: 'Turns product and business data into decisions and reporting.',
        head: 'Noah Patel',
        memberCount: 6,
        createdAt: 'Jun 2023',
    },
    {
        id: 'DEPT-005',
        name: 'People',
        description: 'Handles hiring, onboarding, and employee experience.',
        head: 'Ava Thompson',
        memberCount: 7,
        createdAt: 'Mar 2023',
    },
    {
        id: 'DEPT-006',
        name: 'Operations',
        description: 'Keeps warehouses, logistics, and fulfillment running smoothly.',
        head: 'Liam Rodriguez',
        memberCount: 18,
        createdAt: 'Aug 2023',
    },
    {
        id: 'DEPT-007',
        name: 'Finance',
        description: 'Manages budgeting, billing, and financial planning.',
        head: 'Sofia Rossi',
        memberCount: 5,
        createdAt: 'Sep 2023',
    },
    {
        id: 'DEPT-008',
        name: 'Customer Success',
        description: 'Supports customers and drives retention across the account base.',
        head: 'Ethan Brooks',
        memberCount: 12,
        createdAt: 'Jan 2024',
    },
];

export function listDepartments(): Department[] {
    return [...departments];
}

export function createDepartment(input: {
    name: string;
    description: string;
    head: string;
    memberCount: number;
}): Department {
    const created: Department = {
        ...input,
        id: `DEPT-${String(departments.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    departments = [...departments, created];
    return created;
}

export function updateDepartment(
    id: string,
    input: { name: string; description: string; head: string; memberCount: number },
): void {
    departments = departments.map((department) =>
        department.id === id ? { ...department, ...input } : department,
    );
}

export function removeDepartment(id: string): void {
    departments = departments.filter((department) => department.id !== id);
}
