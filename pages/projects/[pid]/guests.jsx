import Guests from "@components/projects/Guests"
import ProjectLayout from "@components/projects/ProjectLayout"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"
import useUser from "@lib/hooks/useUser"

const GuestsPage = () => {
  const { user } = useUser()

  return (
    <ProjectLayout>
      <Guests user={user} />
    </ProjectLayout>
  )
}

GuestsPage.suppressFirstRenderFlicker= true
// GuestsPage.redirectUnAuthenticatedTo = ROUTES.Login
GuestsPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
GuestsPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default GuestsPage