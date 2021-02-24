import Info from "@components/projects/Info"
import ProjectLayout from "@components/projects/ProjectLayout"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"
import useUser from "@lib/hooks/useUser"

const SettingsPage = () => {
  const { user } = useUser()

  return (
    <ProjectLayout isIndex>
      <Info user={user} />
    </ProjectLayout>
  )
}

SettingsPage.suppressFirstRenderFlicker= true
SettingsPage.redirectUnAuthenticatedTo = ROUTES.Login
SettingsPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
SettingsPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default SettingsPage