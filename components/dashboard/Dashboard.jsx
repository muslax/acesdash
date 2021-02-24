import { ButtonNewProject } from "@components/buttons/ButtonNewProject"
import { SVGSettings, SVGMidi, SVGFamily, SVGCompany } from "@components/SVGIcon"
import { LABEL } from "@lib/constants"
import { useLicense, useProject } from "@lib/hooks"
import useUser from "@lib/hooks/useUser"
import Link from "next/link"
import { useEffect, useState } from "react"
import Hero from "./Hero"

export default function Dashboard() {
  const { user } = useUser()
  const { license, isLoading: licenseLoading } = useLicense()
  const { project, isLoading, isError } = useProject()

  const [modules, setModules] = useState([])

  useEffect(() => {
    if (project) {
      const arr = []
      const keys = []
      project.groups.forEach(group => {
        group.modules.forEach(mod => {
          if (!keys.includes(mod.metaId)) {
            keys.push(mod.metaId)
            arr.push(mod)
          }
        })
      })

      setModules(arr)
    }
  }, [project])

  if (isLoading || licenseLoading) return <></>

  if (isError) return <>ERROR</>

  return (
    <>
      <Hero />
      <div className="mt-8">
        <div className="flex flex-col md:flex-row items-start">
          <div className="w-full md:flex-1">
            <div className="rounded border border-gray-300 p-2 md:mr-6 mb-8 shadow">
              <table className="w-full text-sm bg-indigo-200 bg-opacity-25">
                <tbody>
                  <tr className="bg-white">
                    <td colspan="3" className="px-2 pt-1 pb-2 whitespace-nowrap text-xs text-indigo-500 uppercase font-mono">
                      {LABEL.LICENSE_ID}&nbsp;{license._id}
                    </td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="w-20 px-3 py-2 text-xs text-indigo-500 uppercase">
                      {LABEL.LICENSE_TYPE}
                    </td>
                    <td colspan="2" className="px-3 py-2 border-l border-white uppercase">
                      {license.type}
                    </td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="px-3 py-2 text-xs text-indigo-500 uppercase">
                      {LABEL.LICENSE_OWNER}
                    </td>
                    <td colspan="2" className="px-3 py-2 border-l border-white whitespace-nowrap">
                      {license.licenseName}
                    </td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="px-3 py-2 text-xs text-indigo-500 uppercase">
                      {LABEL.LICENSE_CONTACT}
                    </td>
                    <td colspan="2" className="px-3 py-2 border-l border-white">
                      {license.contactName}
                    </td>
                  </tr>
                  <tr className="border-b border-white">
                    <td className="px-3 py-2 text-xs text-indigo-500 uppercase">
                      {LABEL.LICENSE_SINCE}
                    </td>
                    <td colspan="2" className="px-3 py-2 border-l border-white">
                      {license.publishDate.substr(0, 10)}
                    </td>
                  </tr>
                  <tr className="border-b border-white">
                    <td colspan="2" className="px-3 py-2 text-xs text-indigo-500 uppercase">
                      {LABEL.LICENSE_NUM_OF_USERS}
                    </td>
                    <td className="px-3 py-2 border-l border-white">
                      {license.users}
                    </td>
                  </tr>
                  <tr className="border-b border-white">
                    <td colspan="2" className="px-3 py-2 text-xs text-indigo-500 uppercase">
                      {LABEL.LICENSE_NUM_OF_PROJECTS}
                    </td>
                    <td className="w-10 px-3 py-2 border-l border-white">
                      {license.projects}
                    </td>
                  </tr>
                  <tr className="border-b-2s border-white">
                    <td colspan="2" className="px-3 py-2 text-xs text-indigo-500 uppercase">
                      {LABEL.LICENSE_NUM_OF_CLIENTS}
                    </td>
                    <td className="px-3 py-2 border-l border-white">
                      {license.clients}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {user?.roles?.includes('project-creator') && (
              <div className="hidden md:flex mr-6 mt-6">
                <ButtonNewProject isFull={true} />
              </div>
            )}
          </div>
          <div className="w-full md:flex-grow bg-yellow-100s">
            <div className="border-0 md:border-l pl-0 md:pl-8">
              <h3 className="text-xs text-center md:text-left text-white font-medium tracking-wide uppercase mb-4">
                <span className="inline-block bg-purple-400 rounded-full px-3 py-1 border-b-2s border-yellow-400s">
                  {LABEL.LATEST_PROJECT}
                </span>
              </h3>
              <div className="border p-4 md:border-0 md:p-0">
                <div className="font-bold mb-1">
                  <Link href={`/projects/${project._id}`}>
                    <a className="text-indigo-500 hover:text-indigo-400 hover:underline">
                      {project.title}
                    </a>
                  </Link>
                </div>

                <div className="flex items-center text-gray-700 font-medium mb-6">
                  <SVGCompany className="w-6 h-6 text-pink-500 mr-2"/>
                  <span className="">
                    {project.client.name}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Link href={`/projects/${project._id}/persona`}>
                    <a className="flex items-center text-blue-500 hover:underline whitespace-nowrap mr-4">
                      <SVGFamily className="w-4 h-4 mr-1 text-green-500" />
                      Persona
                    </a>
                  </Link>
                  <Link href={`/projects/${project._id}/groups`}>
                    <a className="flex items-center text-blue-500 hover:underline whitespace-nowrap mr-4">
                    <SVGMidi className="w-4 h-4 mr-1 text-green-500" />
                      Modules
                    </a>
                  </Link>
                  <Link href={`/projects/${project._id}/settings`}>
                    <a className="flex items-center text-blue-500 hover:underline whitespace-nowrap mr-4">
                      <SVGSettings className="w-4 h-4 mr-1 text-green-500" />
                      Settings
                    </a>
                  </Link>
                </div>

                <table className="w-full text-sm border-bs mt-4">
                  <tbody>
                    <tr className="border-t align-top">
                      <td width="120" className="py-2">Admin:</td>
                      <td className="py-2">
                        {project.adminInfo ? project.adminInfo.fullname : '?'}
                      </td>
                    </tr>
                    <tr className="border-t align-top">
                      <td width="120" className="py-2">Modules:</td>
                      <td className="py-2">
                        {modules.map(mod => (
                          <div key={mod.metaId}>
                            &bull; {mod.moduleName}<br/>
                          </div>
                        ))}
                      </td>
                    </tr>
                    <tr className="border-t align-top">
                      <td width="120" className="py-2">Persona:</td>
                      <td className="py-2">
                        {project.totalPersonae}
                      </td>
                    </tr>
                    <tr className="border-t align-top">
                      <td className="py-2">Start date:</td>
                      <td className="py-2">
                        {project.startDate}
                      </td>
                    </tr>
                    <tr className="border-t align-top">
                      <td className="py-2">End date:</td>
                      <td className="py-2">
                        {project.endDate}
                      </td>
                    </tr>
                    <tr className="border-t align-top">
                      <td className="py-2">Launch date:</td>
                      <td className="py-2">
                        {project.openingDate ? project.openingDate : '- not set'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}