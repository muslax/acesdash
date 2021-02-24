import Dashboard from "@components/dashboard/Dashboard"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"

const DashboardPage = () => {
  return (
    <div className="aces-wrap bg-white">
      <div className="aces-geist">
        <Dashboard />
      </div>
    </div>
  )
}

DashboardPage.suppressFirstRenderFlicker= true
// DashboardPage.redirectUnAuthenticatedTo = ROUTES.Login
DashboardPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
DashboardPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default DashboardPage
