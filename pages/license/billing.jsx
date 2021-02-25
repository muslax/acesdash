import BillingInfo from "@components/license/BillingInfo"
import LicenseLayout from "@components/license/LicenseLayout"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"

const BillingPage = () => {
  return (
    <LicenseLayout>
      <BillingInfo />
    </LicenseLayout>
  )
}

BillingPage.suppressFirstRenderFlicker= true
BillingPage.redirectUnAuthenticatedTo = ROUTES.Login
BillingPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
BillingPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default BillingPage