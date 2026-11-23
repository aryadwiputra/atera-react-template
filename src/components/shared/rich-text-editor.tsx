import { useEffect, useState } from 'react'
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Quote, Redo, Strikethrough, Underline, Undo } from 'lucide-react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  ariaLabel?: string
  compact?: boolean
  className?: string
  contentClassName?: string
}

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

export function RichTextEditor({ value, onChange, placeholder, ariaLabel, compact = false, className, contentClassName }: RichTextEditorProps) {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false, autolink: true } })],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class: 'editor-content focus:outline-none',
        'aria-label': ariaLabel ?? 'Rich text editor',
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) editor.commands.setContent(value || '<p></p>', { emitUpdate: false })
  }, [editor, value])

  const isEmpty = useEditorState({
    editor,
    selector: (context) => context.editor.isEmpty,
  })

  const applyLink = () => {
    if (!editor) return
    if (!linkUrl.trim()) {
      setLinkDialogOpen(false)
      return
    }
    const href = linkUrl.trim().startsWith('http') ? linkUrl.trim() : `https://${linkUrl.trim()}`
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    setLinkDialogOpen(false)
  }

  const toggleLink = () => {
    if (!editor) return
    if (editor.isActive('link')) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    setLinkUrl(editor.getAttributes('link').href ?? '')
    setLinkDialogOpen(true)
  }

  return (
    <div className={cn('rounded-lg border bg-background', className)}>
      <div className="flex flex-wrap items-center gap-1 border-b p-1">
        <ToolbarButton icon={Bold} label={t('bold')} isActive={editor?.isActive('bold') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleBold().run()} />
        <ToolbarButton icon={Italic} label={t('italic')} isActive={editor?.isActive('italic') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleItalic().run()} />
        <ToolbarButton icon={Underline} label={t('underline')} isActive={editor?.isActive('underline') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
        <ToolbarButton icon={Strikethrough} label={t('strikethrough')} isActive={editor?.isActive('strike') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleStrike().run()} />
        <Separator orientation="vertical" className="mx-1 !h-6" />
        <ToolbarButton icon={List} label={t('bulletList')} isActive={editor?.isActive('bulletList') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
        <ToolbarButton icon={ListOrdered} label={t('orderedList')} isActive={editor?.isActive('orderedList') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
        {!compact && <ToolbarButton icon={Quote} label={t('blockquote')} isActive={editor?.isActive('blockquote') ?? false} disabled={!editor} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />}
        <ToolbarButton icon={LinkIcon} label={t('link')} isActive={editor?.isActive('link') ?? false} disabled={!editor} onClick={toggleLink} />
        <Separator orientation="vertical" className="mx-1 !h-6" />
        <ToolbarButton icon={Undo} label={t('undo')} isActive={false} disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()} />
        <ToolbarButton icon={Redo} label={t('redo')} isActive={false} disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()} />
      </div>
      <div className={cn('relative', contentClassName)}>
        {editor && <EditorContent editor={editor} />}
        {isEmpty && placeholder && (
          <span className="text-muted-foreground pointer-events-none absolute top-3 left-4 text-sm">{placeholder}</span>
        )}
      </div>

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
            placeholder="https://example.com"
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
    </div>
  )
}
