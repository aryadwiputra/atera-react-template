import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

const SAMPLE_CONTENT = `
<h2>Welcome to the editor</h2>
<p>This is a fully featured rich text editor built with TipTap. It supports all of the common formatting options you would expect, including <strong>bold</strong>, <em>italic</em>, and <s>strikethrough</s> text.</p>
<p>Use the toolbar above to toggle formatting, insert headings, add lists, or undo and redo your changes. Everything updates live and can be extended with additional node types.</p>
<h3>Highlights</h3>
<ul><li>Real-time collaborative-ready document model</li><li>Keyboard shortcuts out of the box</li><li>Fully themeable with CSS variables</li></ul>
<ol><li>Type your content</li><li>Format it to taste</li><li>Export or save it anywhere</li></ol>
`.trim()

export default function EditorPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)

  const editor = useEditor({
    extensions: [StarterKit],
    content: SAMPLE_CONTENT,
    editorProps: {
      attributes: {
        class: 'prose prose-zinc dark:prose-invert mx-auto max-w-none focus:outline-none px-4 py-3 min-h-[320px]',
      },
    },
  })

  const text = editor?.getText() ?? ''
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const characterCount = text.length

  const toolbarItems: {
    icon: typeof Bold
    label: string
    isActive: boolean
    onClick: () => void
    separatorBefore?: boolean
  }[] = [
    {
      icon: Bold,
      label: 'Bold',
      isActive: editor?.isActive('bold') ?? false,
      onClick: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: 'Italic',
      isActive: editor?.isActive('italic') ?? false,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      icon: Strikethrough,
      label: 'Strikethrough',
      isActive: editor?.isActive('strike') ?? false,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
    },
    {
      icon: Heading1,
      label: 'Heading 1',
      isActive: editor?.isActive('heading', { level: 1 }) ?? false,
      onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      isActive: editor?.isActive('heading', { level: 2 }) ?? false,
      onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: List,
      label: 'Bullet list',
      isActive: editor?.isActive('bulletList') ?? false,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      separatorBefore: true,
    },
    {
      icon: ListOrdered,
      label: 'Ordered list',
      isActive: editor?.isActive('orderedList') ?? false,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: Undo,
      label: 'Undo',
      isActive: false,
      onClick: () => editor?.chain().focus().undo().run(),
      separatorBefore: true,
    },
    {
      icon: Redo,
      label: 'Redo',
      isActive: false,
      onClick: () => editor?.chain().focus().redo().run(),
    },
  ]

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
      <PageHeader title={t('editor')} description={t('editorDescription')} />
      <Card>
        <CardHeader>
          <CardTitle>{t('document')}</CardTitle>
          <CardDescription>{t('richTextEditorDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border p-1">
            {toolbarItems.map((item) => (
              <span key={item.label} className="flex items-center">
                {item.separatorBefore && <Separator orientation="vertical" className="mx-2 !h-6" />}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={item.label}
                  onClick={item.onClick}
                  className={cn(item.isActive && 'bg-muted')}
                >
                  <item.icon className="h-4 w-4" />
                </Button>
              </span>
            ))}
          </div>
          <div className="min-h-[320px] rounded-lg border">
            {editor && <EditorContent editor={editor} />}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {t('words')}: <strong>{wordCount}</strong>
            </span>
            <span>
              {t('characters')}: <strong>{characterCount}</strong>
            </span>
          </div>
        </CardContent>
      </Card>
      </main>
    </PageTransition>
  )
}
