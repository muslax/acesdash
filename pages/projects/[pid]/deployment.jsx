import Deployment from "@components/projects/Deployment"
import ProjectLayout from "@components/projects/ProjectLayout"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"
import useUser from "@lib/hooks/useUser"

const DeploymentPage = () => {
  const { user } = useUser()

  return (
    <ProjectLayout>
      <Deployment user={user} />
    </ProjectLayout>
  )
}

DeploymentPage.suppressFirstRenderFlicker= true
DeploymentPage.redirectUnAuthenticatedTo = ROUTES.Login
DeploymentPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
DeploymentPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default DeploymentPage