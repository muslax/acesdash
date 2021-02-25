import LicenseLayout from "@components/license/LicenseLayout"
import LicenseUsers from "@components/license/LicenseUsers"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"

const UsersPage = () => {
  return (
    <LicenseLayout>
      <LicenseUsers />
    </LicenseLayout>
  )
}

UsersPage.suppressFirstRenderFlicker= true
UsersPage.redirectUnAuthenticatedTo = ROUTES.Login
UsersPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
UsersPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default UsersPage