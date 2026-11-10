import type { Employee, OpenPosition } from './types'

let employees: Employee[] = [
  { id: 'EMP-001', name: 'Olivia Martin', position: 'Engineering Manager', department: 'Engineering', email: 'olivia@example.com', startDate: '2022-03-14', status: 'Active' },
  { id: 'EMP-002', name: 'Jackson Lee', position: 'Frontend Engineer', department: 'Engineering', email: 'jackson@example.com', startDate: '2023-06-05', status: 'Remote' },
  { id: 'EMP-003', name: 'Isabella Nguyen', position: 'Product Designer', department: 'Design', email: 'isabella@example.com', startDate: '2023-01-16', status: 'Active' },
  { id: 'EMP-004', name: 'William Kim', position: 'DevOps Engineer', department: 'Engineering', email: 'william@example.com', startDate: '2022-09-01', status: 'On Leave' },
  { id: 'EMP-005', name: 'Emma Davis', position: 'Account Executive', department: 'Sales', email: 'emma@example.com', startDate: '2021-11-22', status: 'Active' },
  { id: 'EMP-006', name: 'Noah Patel', position: 'Data Analyst', department: 'Analytics', email: 'noah@example.com', startDate: '2024-02-12', status: 'Active' },
  { id: 'EMP-007', name: 'Ava Thompson', position: 'HR Generalist', department: 'People', email: 'ava@example.com', startDate: '2023-04-03', status: 'Active' },
  { id: 'EMP-008', name: 'Liam Rodriguez', position: 'Warehouse Supervisor', department: 'Operations', email: 'liam@example.com', startDate: '2021-08-17', status: 'Active' },
  { id: 'EMP-009', name: 'Sofia Rossi', position: 'Financial Analyst', department: 'Finance', email: 'sofia@example.com', startDate: '2024-05-27', status: 'Remote' },
  { id: 'EMP-010', name: 'Ethan Brooks', position: 'Support Lead', department: 'Customer Success', email: 'ethan@example.com', startDate: '2022-12-05', status: 'Active' },
  { id: 'EMP-011', name: 'Mia Johnson', position: 'Content Strategist', department: 'Marketing', email: 'mia@example.com', startDate: '2023-10-09', status: 'On Leave' },
  { id: 'EMP-012', name: 'Lucas Weber', position: 'Backend Engineer', department: 'Engineering', email: 'lucas@example.com', startDate: '2024-01-08', status: 'Active' },
  { id: 'EMP-013', name: 'Chloe Dupont', position: 'Recruiter', department: 'People', email: 'chloe@example.com', startDate: '2023-07-19', status: 'Active' },
  { id: 'EMP-014', name: 'Daniel Okafor', position: 'QA Engineer', department: 'Engineering', email: 'daniel@example.com', startDate: '2020-06-01', status: 'Offboarded' },
]

let openPositions: OpenPosition[] = [
  { id: 'POS-001', title: 'Senior Backend Engineer', department: 'Engineering', applicants: 34, postedAt: '2026-10-20' },
  { id: 'POS-002', title: 'Product Marketing Manager', department: 'Marketing', applicants: 18, postedAt: '2026-10-14' },
  { id: 'POS-003', title: 'Warehouse Associate', department: 'Operations', applicants: 52, postedAt: '2026-10-08' },
  { id: 'POS-004', title: 'UX Researcher', department: 'Design', applicants: 11, postedAt: '2026-09-29' },
  { id: 'POS-005', title: 'Sales Development Rep', department: 'Sales', applicants: 27, postedAt: '2026-09-22' },
]

export const listEmployees = () => [...employees]
export const listOpenPositions = () => [...openPositions]
export const createEmployee = (employee: Omit<Employee, 'id'>) => {
  const created = { ...employee, id: `EMP-${String(employees.length + 1).padStart(3, '0')}` }
  employees = [created, ...employees]
  return created
}
export const updateEmployee = (id: string, updates: Partial<Employee>) => {
  employees = employees.map((employee) => employee.id === id ? { ...employee, ...updates } : employee)
  return employees.find((employee) => employee.id === id)
}
