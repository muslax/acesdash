import LicenseInfo from "@components/license/LicenseInfo"
import LicenseLayout from "@components/license/LicenseLayout"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"

const InfoPage = () => {
  return (
    <LicenseLayout>
      <LicenseInfo />
    </LicenseLayout>
  )
}

InfoPage.suppressFirstRenderFlicker= true
// InfoPage.redirectUnAuthenticatedTo = ROUTES.Login
InfoPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
InfoPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default InfoPage