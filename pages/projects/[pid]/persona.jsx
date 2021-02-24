import PageLoading from "@components/PageLoading"
import AddPersona from "@components/persona/AddPersona"
import ImportPersona from "@components/persona/ImportPersona"
import Personae from "@components/persona/Personae"
import { AppLayout } from "@layouts/AppLayout"
import { ROUTES } from "@lib/constants"
import { useProjectSimpleInfo } from "@lib/hooks"
import Head from "next/head"
import { useRouter } from "next/router"

const PersonaPage = () => {
  const router = useRouter()
  const { pid, task } = router.query
  const { projectSimpleInfo, isLoading, isError } = useProjectSimpleInfo(pid)
  const taskAdd = task !== undefined && task === 'add'
  const taskImport = task !== undefined && task === 'import'

  if (isLoading) return <PageLoading />

  if (taskAdd) return (
    <>
      <Head>
        <title>ACES - Add Persona</title>
      </Head>
      <AddPersona />
    </>
  )

  if (taskImport) return (
    <>
      <Head>
      <title>ACES - Import Persona</title>
      </Head>
      {/*
        I put projectInfo here because useEffect which generate inline style
        always fails..
      */}
      <ImportPersona projectInfo={projectSimpleInfo} />
    </>
  )

  return (
    <>
      <Head>
      <title>Daftar Persona</title>
      </Head>
      <Personae />
    </>
  )
}

PersonaPage.suppressFirstRenderFlicker= true
// PersonaPage.redirectUnAuthenticatedTo = ROUTES.Login
PersonaPage.getLayout = (page) => <AppLayout bgColor="bg-white">{page}</AppLayout>
PersonaPage.skeletonLoader = (
  <AppLayout bgColor="bg-gray-200" isLoading>
    &nbsp;
  </AppLayout>
)

export default PersonaPage
