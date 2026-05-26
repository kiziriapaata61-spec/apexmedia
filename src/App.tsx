import { Navigation } from './components/Navigation'
import { AppProvider, useApp } from './context/AppContext'
import { AdminView } from './views/AdminView'
import { BalanceTransfersView } from './views/BalanceTransfersView'
import { ContractsView } from './views/ContractsView'
import { DashboardView } from './views/DashboardView'
import { LoginView } from './views/LoginView'
import { MeView } from './views/MeView'
import { ReferralsView } from './views/ReferralsView'
import { SecurityView } from './views/SecurityView'
import { SettingsView } from './views/SettingsView'
import { TransactionRecordsView } from './views/TransactionRecordsView'
import { WalletView } from './views/WalletView'

function AppContent() {
  const { isAuthenticated, currentView } = useApp()

  if (!isAuthenticated) {
    return (
      <div className="app-gradient-bg">
        <LoginView />
      </div>
    )
  }

  const views = {
    dashboard: <DashboardView />,
    contracts: <ContractsView />,
    referrals: <ReferralsView />,
    wallet: <WalletView />,
    me: <MeView />,
    settings: <SettingsView />,
    security: <SecurityView />,
    transactions: <TransactionRecordsView />,
    transfers: <BalanceTransfersView />,
    admin: <AdminView />,
  }

  return (
    <div className="app-gradient-bg min-h-screen">
      <Navigation />
      <main className="main-with-mobile-nav">
        {views[currentView as keyof typeof views] ?? <DashboardView />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
