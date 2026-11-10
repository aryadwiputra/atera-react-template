import type { EditorDocument } from './types'

const documents: EditorDocument[] = [
  {
    id: 'DOC-001',
    title: 'Welcome to the editor',
    updatedAt: '2026-11-10T09:20:00.000Z',
    content: `
<h2>Welcome to the editor</h2>
<p>This is a fully featured rich text editor. It supports the formatting you would expect, including <strong>bold</strong>, <em>italic</em>, <u>underline</u>, and <s>strikethrough</s> text.</p>
<p>Use the toolbar above the canvas to toggle formatting, insert headings, add lists, link a phrase, or undo and redo your changes. Everything updates live and saves to the document list on the left.</p>
<h3>Highlights</h3>
<ul><li>Keyboard shortcuts out of the box</li><li>Debounced autosave with manual save</li><li>Fully themeable with CSS variables</li></ul>
<ol><li>Pick a document</li><li>Write and format</li><li>Save, or keep typing</li></ol>
<blockquote><p>The best way to predict the future is to write it down.</p></blockquote>
`.trim(),
  },
  {
    id: 'DOC-002',
    title: 'Q4 product launch notes',
    updatedAt: '2026-11-08T14:05:00.000Z',
    content: `
<h2>Launch scope</h2>
<p>The Q4 release focuses on <strong>retention</strong> and <strong>clarity</strong>. We ship the editor as the flagship authoring surface, then fold in analytics for every published piece.</p>
<h3>Checklist</h3>
<ul><li>Document store and list sidebar</li><li>Toolbar parity with desktop app</li><li>Saved state feedback</li></ul>
<h3>Risks</h3>
<p>Draft migration is the only open item. Coordinate with <em>platform</em> before the freeze.</p>
`.trim(),
  },
  {
    id: 'DOC-003',
    title: 'Editor roadmap',
    updatedAt: '2026-11-02T10:40:00.000Z',
    content: `
<h2>Roadmap</h2>
<p>Planned additions, in order. Each item should land behind a flag first.</p>
<ol><li>Images and tables</li><li>Slash commands</li><li>Markdown import/export</li><li>Version history</li></ol>
`.trim(),
  },
]

let sequence = documents.length

export const listEditorDocuments = () => [...documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

export const getEditorDocument = (id: string) => documents.find((document) => document.id === id) ?? null

export const createEditorDocument = (input: Partial<Pick<EditorDocument, 'title' | 'content'>> = {}) => {
  sequence += 1
  const document: EditorDocument = {
    id: `DOC-${String(sequence).padStart(3, '0')}`,
    title: input.title?.trim() || 'Untitled document',
    content: input.content ?? '<p></p>',
    updatedAt: new Date().toISOString(),
  }
  documents.unshift(document)
  return document
}

export const updateEditorDocument = (id: string, changes: Partial<Pick<EditorDocument, 'title' | 'content'>>) => {
  const document = documents.find((item) => item.id === id)
  if (!document) return null
  if (changes.title !== undefined) document.title = changes.title
  if (changes.content !== undefined) document.content = changes.content
  document.updatedAt = new Date().toISOString()
  return document
}

export const removeEditorDocument = (id: string) => {
  const index = documents.findIndex((item) => item.id === id)
  if (index === -1) return false
  documents.splice(index, 1)
  return true
}
