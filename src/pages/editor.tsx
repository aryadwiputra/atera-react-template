import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Pilcrow,
  Redo,
  Strikethrough,
  Trash2,
  Undo,
  Underline,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useToast } from '@/components/shared/toast'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { createEditorDocument, getEditorDocument, listEditorDocuments, removeEditorDocument, updateEditorDocument } from '@/lib/data/editor-docs'
import { cn } from '@/lib/utils'

function ToolbarButton({ icon: Icon, label, isActive, disabled, onClick }: { icon: typeof Bold; label: string; isActive: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      disabled={disabled}
      onClick={onClick}
      className={cn('h-8 w-8', isActive && 'bg-muted text-foreground')}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

export default function EditorPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()

  const [docs, setDocs] = useState(() => listEditorDocuments())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const pendingSelectionRef = useRef<number | null>(null)

  const activeDoc = activeId ? getEditorDocument(activeId) : null
  const initialContent = activeDoc?.content ?? '<p></p>'

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'editor-content min-h-[360px] focus:outline-none',
      },
    },
    onCreate: () => {
      // Switching documents re-creates the editor; re-focus on the restored selection.
    },
  })

  // Load a document into the editor when the selection changes.
  useEffect(() => {
    if (!editor) return
    if (!activeDoc) {
      editor.commands.setContent('<p></p>')
      return
    }
    const restored = pendingSelectionRef.current
    editor.commands.setContent(activeDoc.content, { emitUpdate: false })
    if (restored !== null) {
      const doc = editor.state.doc
      const target = Math.min(restored, doc.content.size)
      editor.chain().focus('end').setTextSelection(target).run()
      pendingSelectionRef.current = null
    }
  }, [editor, activeDoc?.id])

  const refreshDocs = () => setDocs(listEditorDocuments())

  const persist = (titleOverride?: string) => {
    if (!editor || !activeId) return
    const content = editor.getHTML()
    const title = titleOverride ?? firstHeading(editor, t('untitledDocument'))
    updateEditorDocument(activeId, { content, title })
    setDirty(false)
    setSavedAt(new Date())
    refreshDocs()
  }

  // Debounced autosave while typing.
  useEffect(() => {
    if (!editor || !dirty || !activeId) return
    const timer = setTimeout(() => persist(), 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.state.doc, dirty])

  const activeTitle = useEditorState({
    editor,
    selector: (context) => firstHeading(context.editor, t('untitledDocument')),
  })

  // Title + counts derived from the editor state (re-renders on every change).
  const counts = useEditorState({
    editor,
    selector: (context) => {
      const text = context.editor.getText()
      return {
        words: text.trim() ? text.trim().split(/\s+/).length : 0,
        characters: text.length,
      }
    },
  })

  const createDoc = () => {
    const doc = createEditorDocument({ title: t('untitledDocument') })
    refreshDocs()
    setActiveId(doc.id)
    setDirty(false)
  }

  const deleteDoc = (id: string) => {
    removeEditorDocument(id)
    const remaining = listEditorDocuments()
    refreshDocs()
    if (id === activeId) setActiveId(remaining[0]?.id ?? null)
    toast({ title: t('documentDeleted'), variant: 'success' })
  }

  const selectDoc = (id: string) => {
    if (id === activeId) return
    if (editor && activeId && dirty) {
      pendingSelectionRef.current = editor.state.selection.$from.pos
    }
    persist()
    setActiveId(id)
    setDirty(false)
  }

  const toggleLink = () => {
    if (!editor) return
    if (editor.isActive('link')) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    pendingSelectionRef.current = editor.state.selection.$from.pos
    setLinkUrl(editor.getAttributes('link').href ?? '')
    setLinkDialogOpen(true)
  }

  const applyLink = () => {
    if (!editor || !linkUrl.trim()) {
      setLinkDialogOpen(false)
      return
    }
    const href = linkUrl.trim().startsWith('http') ? linkUrl.trim() : `https://${linkUrl.trim()}`
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    setLinkDialogOpen(false)
  }

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          breadcrumbs={[{ title: t('editor'), href: '/editor' }]}
          title={t('editor')}
          description={t('editorDescription')}
          actions={
            <Button
              size="sm"
              onClick={() => {
                if (activeId) {
                  persist()
                  toast({ title: t('documentSaved'), variant: 'success' })
                }
              }}
              disabled={!activeId}
            >
              {t('save')}
            </Button>
          }
        />
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>{t('documents')}</CardTitle>
              <CardDescription>{t('docListDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button size="sm" variant="outline" onClick={createDoc}>
                {t('newDocument')}
              </Button>
              <ul className="flex flex-col gap-1">
                {docs.map((doc) => (
                  <li key={doc.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => selectDoc(doc.id)}
                      className={cn(
                        'w-full rounded-md border px-3 py-2 text-left text-sm transition-colors',
                        doc.id === activeId
                          ? 'border-primary/40 bg-primary/5 text-foreground'
                          : 'border-transparent text-muted-foreground hover:bg-muted',
                      )}
                    >
                      <span className="block truncate pr-6 font-medium">{doc.title}</span>
                      <span className="mt-0.5 block text-xs opacity-70">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title={t('deleteDocument')}
                          aria-label={t('deleteDocument')}
                          onClick={(event) => event.stopPropagation()}
                          className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('deleteDocument')}</DialogTitle>
                          <DialogDescription>{t('deleteDocumentDescription')}</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => undefined}>
                            {t('cancel')}
                          </Button>
                          <Button variant="destructive" onClick={() => deleteDoc(doc.id)}>
                            {t('deleteDocument')}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate">{activeTitle ?? t('untitledDocument')}</CardTitle>
                  <CardDescription>
                    {dirty ? t('saving') : savedAt ? `${t('saved')} · ${savedAt.toLocaleTimeString()}` : t('editorPlaceholder')}
                  </CardDescription>
                </div>
                {activeDoc && <span className="shrink-0 text-xs text-muted-foreground">{activeDoc.id}</span>}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-1 rounded-lg border p-1">
                <ToolbarButton icon={Bold} label={t('bold')} isActive={editor?.isActive('bold') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleBold().run()} />
                <ToolbarButton icon={Italic} label={t('italic')} isActive={editor?.isActive('italic') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleItalic().run()} />
                <ToolbarButton icon={Underline} label={t('underline')} isActive={editor?.isActive('underline') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
                <ToolbarButton icon={Strikethrough} label={t('strikethrough')} isActive={editor?.isActive('strike') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleStrike().run()} />
                <Separator orientation="vertical" className="mx-1 !h-6" />
                <ToolbarButton icon={Heading1} label={t('heading1')} isActive={editor?.isActive('heading', { level: 1 }) ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} />
                <ToolbarButton icon={Heading2} label={t('heading2')} isActive={editor?.isActive('heading', { level: 2 }) ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
                <ToolbarButton icon={Heading3} label={t('heading3')} isActive={editor?.isActive('heading', { level: 3 }) ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} />
                <ToolbarButton icon={Pilcrow} label={t('paragraph')} isActive={editor?.isActive('paragraph') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().setParagraph().run()} />
                <Separator orientation="vertical" className="mx-1 !h-6" />
                <ToolbarButton icon={List} label={t('bulletList')} isActive={editor?.isActive('bulletList') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
                <ToolbarButton icon={ListOrdered} label={t('orderedList')} isActive={editor?.isActive('orderedList') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
                <ToolbarButton icon={Quote} label={t('blockquote')} isActive={editor?.isActive('blockquote') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />
                <ToolbarButton icon={LinkIcon} label={t('link')} isActive={editor?.isActive('link') ?? false} disabled={!editor} onClick={toggleLink} />
                <Separator orientation="vertical" className="mx-1 !h-6" />
                <ToolbarButton icon={Undo} label={t('undo')} isActive={false} disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()} />
                <ToolbarButton icon={Redo} label={t('redo')} isActive={false} disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()} />
              </div>
              <div className="min-h-[360px] rounded-lg border bg-background">
                {editor && <EditorContent editor={editor} />}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {t('wordCount')}: <strong className="text-foreground">{counts?.words ?? 0}</strong>
                </span>
                <span>
                  {t('characters')}: <strong className="text-foreground">{counts?.characters ?? 0}</strong>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('insertLink')}</DialogTitle>
            <DialogDescription>{t('linkUrl')}</DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://lucif.ai"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                applyLink()
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" disabled={editor?.isActive('link') !== true} onClick={() => editor?.chain().focus().extendMarkRange('link').unsetLink().run()}>
              {t('removeLink')}
            </Button>
            <Button onClick={applyLink}>{t('insertLink')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}

function firstHeading(editor: { getHTML: () => string }, fallback: string): string {
  const heading = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/i.exec(editor.getHTML())
  if (!heading) return fallback
  const text = heading[1].replace(/<[^>]*>/g, '').trim()
  return text || fallback
}
