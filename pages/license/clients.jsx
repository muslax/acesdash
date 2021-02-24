import LicenseLayout from "@components/license/LicenseLayout"
import LicenseClients from "@components/license/LicenseClients"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"

const ClientsPage = () => {
  return (
    <LicenseLayout>
      <LicenseClients />
    </LicenseLayout>
  )
}

ClientsPage.suppressFirstRenderFlicker= true
// ClientsPage.redirectUnAuthenticatedTo = ROUTES.Login
ClientsPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
ClientsPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default ClientsPage