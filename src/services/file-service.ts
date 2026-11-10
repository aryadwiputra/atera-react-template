import { listFiles } from '@/lib/data/files'
import { type FileItem } from '@/lib/data/types'

export interface FileService {
  list(): FileItem[]
}

export const fileService: FileService = {
  list: listFiles,
}
