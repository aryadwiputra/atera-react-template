import { type Employee, type OpenPosition } from '@/lib/data/types'
import { createEmployee, listEmployees, listOpenPositions, updateEmployee } from '@/lib/data/hr'

export interface HrService {
  listEmployees(): Employee[]
  listOpenPositions(): OpenPosition[]
  createEmployee(input: Omit<Employee, 'id'>): Employee
  updateEmployee(id: string, updates: Partial<Employee>): Employee | undefined
}

export const hrService: HrService = {
  listEmployees,
  listOpenPositions,
  createEmployee,
  updateEmployee,
}
