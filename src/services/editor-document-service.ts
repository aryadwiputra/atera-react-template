import { listEditorDocuments, getEditorDocument, createEditorDocument, updateEditorDocument, removeEditorDocument } from '@/lib/data/editor-docs'
import { type EditorDocument } from '@/lib/data/types'

export interface EditorDocumentService {
  list(): EditorDocument[]
  get(id: string): EditorDocument | null
  create(input?: Partial<Pick<EditorDocument, 'title' | 'content'>>): EditorDocument
  update(id: string, changes: Partial<Pick<EditorDocument, 'title' | 'content'>>): EditorDocument | null
  remove(id: string): boolean
}

export const editorDocumentService: EditorDocumentService = {
  list: listEditorDocuments,
  get: getEditorDocument,
  create: createEditorDocument,
  update: updateEditorDocument,
  remove: removeEditorDocument,
}
