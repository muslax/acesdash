import LicenseInfo from "@components/license/LicenseInfo"
import LicenseLayout from "@components/license/LicenseLayout"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"

const SettingsPage = () => {
  return (
    <LicenseLayout isIndex>
      <LicenseInfo />
    </LicenseLayout>
  )
}

SettingsPage.suppressFirstRenderFlicker= true
// SettingsPage.redirectUnAuthenticatedTo = ROUTES.Login
SettingsPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
SettingsPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default SettingsPage