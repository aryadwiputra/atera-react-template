export type DemoPerson = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Away' | 'Offline';
    joined: string;
};

const firstNames = ['Olivia', 'Jackson', 'Isabella', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan'];
const lastNames = ['Martin', 'Lee', 'Nguyen', 'Patel', 'Garcia', 'Kim'];
const roles = ['Admin', 'Editor', 'Analyst', 'Support', 'Viewer'];
const statuses: DemoPerson['status'][] = ['Active', 'Away', 'Offline'];

export const demoPeople: DemoPerson[] = firstNames.flatMap((firstName, firstIndex) =>
    lastNames.map((lastName, lastIndex) => {
        const index = firstIndex * lastNames.length + lastIndex;
        return {
            id: `USR-${1000 + index}`,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@atera.dev`,
            role: roles[index % roles.length],
            status: statuses[index % statuses.length],
            joined: `2025-${String((index % 12) + 1).padStart(2, '0')}-${String(
                (index % 27) + 1,
            ).padStart(2, '0')}`,
        };
    }),
);
