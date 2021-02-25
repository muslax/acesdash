import Projects from "@components/projects/Projects"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"

const ProjectsPage = () => {
  return (
    <>
      <Projects />
    </>
  )
}

ProjectsPage.suppressFirstRenderFlicker= true
ProjectsPage.redirectUnAuthenticatedTo = ROUTES.Login
ProjectsPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
ProjectsPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default ProjectsPage
