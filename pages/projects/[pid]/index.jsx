import Overview from "@components/projects/Overview"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"

const OverviewPage = () => {

  return <Overview />
}

OverviewPage.suppressFirstRenderFlicker= true
// OverviewPage.redirectUnAuthenticatedTo = ROUTES.Login
OverviewPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
OverviewPage.skeletonLoader = (
  <AppLayout bgColor="bg-gray-200" isLoading>
    &nbsp;
  </AppLayout>
)

export default OverviewPage
