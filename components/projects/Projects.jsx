import { useLicense, useProjects } from "@lib/hooks";
import { ButtonNewProject } from "../buttons/ButtonNewProject";
import PageLoading from "../PageLoading";
import ProjectOnboarding from "./ProjectOnboarding";
import { SVGClient } from "../SVGIcon";
import { SVGProject } from "../SVGIcon";
import ProjectsTable from "./ProjectsTable";
import useUser from "@lib/hooks/useUser";

export default function Projects() {
  const { license, isLoading, isError } = useLicense()

  if (isLoading) return <PageLoading />

  if (license.projects === 0) return <ProjectOnboarding />

  return (
    <>
      <Hero license={license} />
      <div className="aces-wrap">
        <div className="aces-geist">
          <ProjectsTable />
        </div>
      </div>
    </>
  )
}

function Hero({ license }) {
  const { user } = useUser()
  // const { license, isLoading, isError } = useLicense()

  return (
    <div className="aces-wrap bg-white border-bs border-gray-200 pt-6 pb-4">
      <div className="aces-geist">
        <div className="text-center md:text-left">
          <h2 className="text-3xl text-gray-800 leading-snug tracking-loose mb-1">
            ACES Projects
          </h2>
          <p className="text-gray-600 font-medium mb-2">
            {license ? license.licenseName : '...'}
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-end">
          <div className="flex-grow flex justify-center md:justify-start mt-6 pb-1s">
            <div className="flex items-center text-xs text-gray-500 uppercase font-semibold">
              <SVGProject className="text-green-500 w-4 h-4mr-1"/>
              <span className="">Projects:</span>
              <span className="text-gray-800 font-bold px-1">
                {license ? license.projects : '-'}
              </span>
              <SVGClient className="text-yellow-500 w-4 h-4 ml-2 mr-1"/>
              <span className="">Clients:</span>
              <span className="text-gray-800 font-bold px-1">
                {license? license.clients : '-'}
              </span>
            </div>
          </div>
          {user?.roles?.includes('project-creator') && (
          <p className="text-center md:text-left mt-3 md:mt-6">
            <ButtonNewProject />
          </p>
          )}
        </div>
      </div>
    </div>
  )
}