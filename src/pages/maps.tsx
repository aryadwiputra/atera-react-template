import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { Building2, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = defaultIcon

const BRANCHES = [
  {
    id: 'hq',
    name: 'Berlin Headquarters',
    address: 'Unter den Linden 21, 10117 Berlin, Germany',
    city: 'Berlin',
    employees: 482,
    position: [52.517, 13.389] as [number, number],
    type: 'HQ',
  },
  {
    id: 'munich',
    name: 'Munich Office',
    address: 'Marienplatz 8, 80331 Munich, Germany',
    city: 'Munich',
    employees: 213,
    position: [48.137, 11.575] as [number, number],
    type: 'Engineering',
  },
  {
    id: 'hamburg',
    name: 'Hamburg Branch',
    address: 'Mönckebergstraße 17, 20095 Hamburg, Germany',
    city: 'Hamburg',
    employees: 156,
    position: [53.551, 9.994] as [number, number],
    type: 'Sales',
  },
  {
    id: 'cologne',
    name: 'Cologne Branch',
    address: 'Hohenzollernring 52, 50672 Cologne, Germany',
    city: 'Cologne',
    employees: 98,
    position: [50.938, 6.96] as [number, number],
    type: 'Support',
  },
  {
    id: 'frankfurt',
    name: 'Frankfurt Branch',
    address: 'Neue Mainzer Straße 66, 60311 Frankfurt, Germany',
    city: 'Frankfurt',
    employees: 127,
    position: [50.111, 8.682] as [number, number],
    type: 'Finance',
  },
  {
    id: 'dresden',
    name: 'Dresden Branch',
    address: 'Prager Straße 15, 01069 Dresden, Germany',
    city: 'Dresden',
    employees: 61,
    position: [51.053, 13.74] as [number, number],
    type: 'Design',
  },
]

export default function MapsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
      <PageHeader title={t('maps')} description={t('mapsDescription')} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{t('officeLocations')}</CardTitle>
            <CardDescription>{t('officeLocationsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[480px] overflow-hidden rounded-lg border">
              <MapContainer
                center={[51.1, 10.4]}
                zoom={6}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {BRANCHES.map((branch) => (
                  <Marker key={branch.id} position={branch.position}>
                    <Popup>
                      <div className="space-y-1">
                        <p className="font-semibold">{branch.name}</p>
                        <p className="text-sm text-muted-foreground">{branch.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('locations')}</CardTitle>
            <CardDescription>{t('locationsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            {BRANCHES.map((branch, index) => (
              <div key={branch.id}>
                {index > 0 && <Separator className="my-3" />}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{branch.name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {t('city')}: {branch.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {t('employees')}: {branch.employees}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{branch.type}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      </main>
    </PageTransition>
  )
}
