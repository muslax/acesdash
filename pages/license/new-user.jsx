import FormNewUser from "@components/license/FormNewUser"
import LicenseLayout from "@components/license/LicenseLayout"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"

const NewUserPage = () => {
  return (
    <LicenseLayout>
      <FormNewUser />
    </LicenseLayout>
  )
}

NewUserPage.suppressFirstRenderFlicker= true
NewUserPage.redirectUnAuthenticatedTo = ROUTES.Login
NewUserPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
NewUserPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default NewUserPage