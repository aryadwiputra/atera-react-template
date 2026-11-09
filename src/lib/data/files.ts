import type { FileItem } from './types'

const files: FileItem[] = [
  { id: 'FIL-001', name: 'Brand assets', type: 'folder', updated: 'Today', owner: 'Avery Morgan' },
  { id: 'FIL-002', name: 'Q4 business review.pdf', type: 'document', size: '2.4 MB', updated: 'Yesterday', owner: 'Sofia Chen' },
  { id: 'FIL-003', name: 'Revenue forecast.xlsx', type: 'spreadsheet', size: '840 KB', updated: 'Nov 3, 2026', owner: 'Avery Morgan' },
  { id: 'FIL-004', name: 'Team offsite.jpg', type: 'image', size: '4.1 MB', updated: 'Oct 28, 2026', owner: 'Nora Patel' },
]

export const listFiles = () => [...files]
