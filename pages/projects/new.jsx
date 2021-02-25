import NewProject from "@components/projects/NewProject"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"
import useUser from "@lib/hooks/useUser"
import { useRouter } from "next/router"

const NewProjectPage = () => {
  const { user } = useUser()
  const router = useRouter()

  if (!user?.roles.includes('project-creator')) {
    router.push('/projects')
  }

  return <NewProject />
}

NewProjectPage.suppressFirstRenderFlicker= true
NewProjectPage.redirectUnAuthenticatedTo = ROUTES.Login
NewProjectPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
NewProjectPage.skeletonLoader = (
  <AppLayout isLoading>
    &nbsp;
  </AppLayout>
)

export default NewProjectPage
