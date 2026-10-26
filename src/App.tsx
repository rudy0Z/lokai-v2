import { AppProvider } from './app/lib/app-context'
import { useHashRoute } from './app/lib/router'
import { Toaster } from 'sonner'
import { ErrorBoundary } from './app/components/ui/ErrorBoundary'
import ChatPage from './app/pages/ChatPage'
import SpecimenPage from './app/pages/SpecimenPage'
import GalleryPage from './app/pages/GalleryPage'
import DevLauncherPage from './app/pages/DevLauncherPage'
import VoiceCapturePage from './app/pages/VoiceCapturePage'
import NoticePage from './app/pages/NoticePage'
import HistoryPage from './app/pages/HistoryPage'
import SavedPage from './app/pages/SavedPage'
import ProfilePage from './app/pages/ProfilePage'
import MatterDetailPage from './app/pages/MatterDetailPage'

function Routes() {
  const { path } = useHashRoute()
  if (path.startsWith('/matter/')) {
    return <MatterDetailPage id={path.split('/')[2] ?? ''} />
  }
  switch (path) {
    case '/specimen':
      return <SpecimenPage />
    case '/gallery':
      return <GalleryPage />
    case '/dev':
      return <DevLauncherPage />
    case '/voice':
      return <VoiceCapturePage />
    case '/notice':
      return <NoticePage />
    case '/history':
      return <HistoryPage />
    case '/saved':
      return <SavedPage />
    case '/profile':
      return <ProfilePage />
    default:
      return <ChatPage />
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Routes />
        <Toaster position="top-center" duration={2600} />
      </AppProvider>
    </ErrorBoundary>
  )
}
