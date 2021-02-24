import Link from 'next/link'
import PropsWithChildren from "@components/PropsWithChildren"
import { ROUTES } from "@lib/constants"
import useUser from "@lib/hooks/useUser"

const UserPage = () => {
  const { user } = useUser({ redirecTo: ROUTES.Login })

  if (!user) return <></>

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="max-w-xl h-80s overflow-auto">
        <Link href={ROUTES.Dashboard}>
          <a className="text-blue-500">Dashboard</a>
        </Link>
        <pre className="text-xs">
          {JSON.stringify(user, null, 2)}
        </pre>
        <hr className="my-4" />
        <PropsWithChildren soul="Doremi" mit="KOL">
          <p>Children of Component</p>
        </PropsWithChildren>
      </div>
    </div>
  )
}

UserPage.getLayout = (page) => <WebLayout>{page}</WebLayout>
UserPage.suppressFirstRenderFlicker = true;

export default UserPage