import { FileSpreadsheet, FileText, Folder, Grid3x3, Image, List, MoreHorizontal, Plus, Search, Upload } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'
import { listFiles } from '@/lib/data/files'

const typeIcons = { folder: Folder, document: FileText, spreadsheet: FileSpreadsheet, image: Image } as const

export default function FilesPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const files = listFiles().filter((file) => file.name.toLowerCase().includes(search.toLowerCase()))

  const simulateUpload = () => {
    setUploading(true)
    setUploaded(false)
    setTimeout(() => {
      setUploading(false)
      setUploaded(true)
      setTimeout(() => setUploaded(false), 2000)
    }, 800)
  }

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader
          title={t('files')}
          description={t('filesDescription')}
          actions={
            <>
              {uploaded && <span className="text-xs text-muted-foreground">{t('uploadComplete')}</span>}
              <Button size="sm" variant="outline" onClick={simulateUpload} disabled={uploading}>
                <Upload className="size-4" />
                {uploading ? t('uploading') : t('upload')}
              </Button>
              <Button size="sm">
                <Plus className="size-4" />
                {t('newFolder')}
              </Button>
            </>
          }
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5">
            <Search className="size-4 text-muted-foreground" />
            <Input className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('searchFiles')} />
          </div>
          <div className="flex rounded-md border p-0.5">
            <button type="button" aria-label={t('gridView')} onClick={() => setView('grid')} className={cn('rounded p-1.5', view === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground')}>
              <Grid3x3 className="size-4" />
            </button>
            <button type="button" aria-label={t('listView')} onClick={() => setView('list')} className={cn('rounded p-1.5', view === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground')}>
              <List className="size-4" />
            </button>
          </div>
        </div>
        {view === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {files.map((file) => {
              const Icon = typeIcons[file.type]
              return (
                <Card key={file.id}>
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <Icon className="size-8 text-muted-foreground" />
                      <Button variant="ghost" size="icon" aria-label={t('more')}>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                    <p className="truncate font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size ?? t('folder')} · {file.updated}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              {files.map((file) => {
                const Icon = typeIcons[file.type]
                return (
                  <div key={file.id} className="flex items-center gap-4 border-b p-4 last:border-0">
                    <Icon className="size-5 shrink-0 text-muted-foreground" />
                    <p className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</p>
                    <p className="hidden text-xs text-muted-foreground sm:block">{file.owner}</p>
                    <p className="text-xs text-muted-foreground">{file.size ?? t('folder')}</p>
                    <p className="hidden text-xs text-muted-foreground md:block">{file.updated}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}
      </main>
    </PageTransition>
  )
}
