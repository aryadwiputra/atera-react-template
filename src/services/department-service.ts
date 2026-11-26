import {
    createDepartment,
    listDepartments,
    removeDepartment,
    updateDepartment,
} from '@/lib/data/departments';
import type { Department } from '@/lib/data/types';

export interface DepartmentService {
    list(): Department[];
    create(input: {
        name: string;
        description: string;
        head: string;
        memberCount: number;
    }): Department;
    update(
        id: string,
        input: { name: string; description: string; head: string; memberCount: number },
    ): void;
    remove(id: string): void;
}

export const departmentService: DepartmentService = {
    list: listDepartments,
    create: createDepartment,
    update: updateDepartment,
    remove: removeDepartment,
};
