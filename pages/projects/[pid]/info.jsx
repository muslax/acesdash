import Info from "@components/projects/Info"
import ProjectLayout from "@components/projects/ProjectLayout"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"
import useUser from "@lib/hooks/useUser"

const InfoPage = () => {
  const { user } = useUser()

  return (
    <ProjectLayout>
      <Info user={user} />
    </ProjectLayout>
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