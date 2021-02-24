import Modules from "@components/projects/Modules"
import ProjectLayout from "@components/projects/ProjectLayout"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"
import useUser from "@lib/hooks/useUser"

const ModulesPage = () => {
  const { user } = useUser()

  return (
    <ProjectLayout>
      <Modules user={user} />
    </ProjectLayout>
  )
}

ModulesPage.suppressFirstRenderFlicker= true
// ModulesPage.redirectUnAuthenticatedTo = ROUTES.Login
ModulesPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
ModulesPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default ModulesPage