import ProjectLayout from "@components/projects/ProjectLayout"
import Schedules from "@components/projects/Schedules"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"
import useUser from "@lib/hooks/useUser"

const SchedulesPage = () => {
  const { user } = useUser()

  return (
    <ProjectLayout>
      <Schedules user={user} />
    </ProjectLayout>
  )
}

SchedulesPage.suppressFirstRenderFlicker= true
// SchedulesPage.redirectUnAuthenticatedTo = ROUTES.Login
SchedulesPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
SchedulesPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default SchedulesPage