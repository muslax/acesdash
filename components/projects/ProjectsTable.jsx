import ButtonExpander from "@components/buttons/ButtonExpander";
import PageLoading from "@components/PageLoading";
import fetchJson from "@lib/fetchJson";
import { useProjects } from "@lib/hooks";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function ProjectsTable() {
  const { projects, isLoading, isError } = useProjects()
  const [showStack, setShowStack] = useState([])

  if (isLoading) return <PageLoading />

  return (
    <div className="">
      <table className="w-full border-ts border-b border-gray-300">
        <thead className="bg-gray-200 bg-opacity-75">
          <tr className="text-sm text-gray-500 border-b border-gray-300 font-semibold align-middle">
            <td width="30" className="h-10s p-2">#</td>
            <td className="p-2 border-l border-gray-200 border-opacity-75">Project Title</td>
            <td className="p-2 border-l border-gray-200 border-opacity-75">Client</td>
            <td className="p-2 border-l border-gray-200 border-opacity-75">Admin</td>
            <td className="w-16 p-2 border-l border-gray-200 border-opacity-75 text-right">Persona</td>
            <td width="20" className="p-2 border-l border-gray-200 border-opacity-75">
              <div className="flex">
                {/* <EVGEllipsis /> */}&nbsp;
              </div>
            </td>
          </tr>
        </thead>
        {projects?.map((project, index) => {
          const adminInfo = project.adminInfo.length > 0 ? project.adminInfo[0] : null
          return (
            <tbody key={project._id} className="text-sm text-gray-700">
              {!showStack.includes(project._id) && (
              <tr className="border-t border-gray-200">
                <td width="30" className="px-3 py-2">{index + 1}</td>
                <td className="px-3 py-2 border-l border-gray-300 border-opacity-50">
                  <Link href={`/projects/${project._id}`}>
                    <a className="text-blue-500 font-semibolds hover:underline">
                    {project.shortTitle}
                    </a>
                  </Link>
                </td>
                <td className="px-3 py-2 border-l border-gray-300 border-opacity-50">{project.client.name}</td>
                <td className="px-3 py-2 border-l border-gray-300 border-opacity-50">{adminInfo ? adminInfo.fullname : ''}</td>
                <td className="px-3 py-2 border-l border-gray-300 border-opacity-50 text-right">{project.totalPersonae}</td>
                <td valign="middle" className="px-3 py-2 border-l border-gray-300 border-opacity-50">
                  <div className="flex">
                    <ButtonExpander clickHandler={e => {
                      if (!showStack.includes(project._id)) {
                        setShowStack(prev => ([
                          ...prev,
                          project._id
                        ]))
                      } else {
                        setShowStack(showStack.filter((item) => {
                          return item !== project._id
                        }))
                      }
                    }}/>
                  </div>
                </td>
              </tr>
              )}
              {showStack.includes(project._id) && (
              <tr className="border-t border-gray-200">
                <td width="30" className="px-3 py-2">{index + 1}</td>
                <td colSpan="4" className="px-3 py-2 border-l border-gray-300 border-opacity-50">
                  <span className="font-medium">
                    {project.title}
                  </span>
                </td>
                <td className="px-3 py-2 border-l border-gray-300 border-opacity-50">
                  <div className="flex">
                    <ButtonExpander initialState={true} clickHandler={e => {
                      if (!showStack.includes(project._id)) {
                        setShowStack(prev => ([
                          ...prev,
                          project._id
                        ]))
                      } else {
                        setShowStack(showStack.filter((item) => {
                          return item !== project._id
                        }))
                      }
                    }}/>
                  </div>
                </td>
              </tr>
              )}
              {showStack.includes(project._id) && (
              <tr className="text-sm border-t border-gray-300 bg-green-50 bg-opacity-50 from-purple-50 border-bs">
                <td></td>
                <td colSpan="5" className="pl-3 pr-5 py-4">
                  <div className="float-right text-right text-gray-400 leading-loose pl-6">
                    <Link href={`/projects/${project._id}`}>
                      <a className="text-blue-500 hover:underline">Overview</a>
                    </Link>
                    &nbsp;&rarr;<br/>
                    <Link href={`/projects/${project._id}/persona`}>
                      <a className="text-blue-500 hover:underline">Persona</a>
                    </Link>
                    &nbsp;&rarr;<br/>
                    <Link href={`/projects/${project._id}/modules`}>
                      <a className="text-blue-500 hover:underline">Modules</a>
                    </Link>
                    &nbsp;&rarr;<br/>
                    <Link href={`/projects/${project._id}/guests`}>
                      <a className="text-blue-500 hover:underline">Guests</a>
                    </Link>
                    &nbsp;&rarr;<br/>
                    <Link href={`/projects/${project._id}/deployment`}>
                      <a className="text-blue-500 hover:underline">Deployment</a>
                    </Link>
                    &nbsp;&rarr;
                  </div>
                  <ProjectBrief project={project} />
                </td>
              </tr>
              )}
            </tbody>
          )
        })}
      </table>
      <pre>
        {/* {JSON.stringify(projectModules, null, 2)} */}
      </pre>
    </div>
  )
}

const ProjectBrief = ({ project }) => {
  const url = `/api/get?q=get-project-modules&pid=${project._id}&simple=1`
  const { data: modules, error } = useSWR(url, fetchJson)

  const adminInfo = project.adminInfo.length > 0 ? project.adminInfo[0] : null

  function parseModules() {
    if (!modules || modules.length == 0) return <span>(not set)</span>
    let array = []
    modules.forEach(m => array.push(m.moduleName))

    return (
      <span className="text-pink-700 font-semibold uppercases">{array.join(', ')}</span>
    )
  }

  return (
    <table className="text-sm mb-2">
      <thead>
        <tr className="">
          <td width="100" className="text-purple-500 text-right py-1">Project ID:</td>
          <td className="py-1 pl-4">{project._id}</td>
        </tr>
        <tr className="">
          <td className="text-purple-500 text-right py-1">Client:</td>
          <td className="py-1 pl-4">{project.client.name}, {project.client.city}</td>
        </tr>
        <tr className="">
          <td className="text-purple-500 text-right py-1">Short title:</td>
          <td className="py-1 pl-4">{project.shortTitle}</td>
        </tr>
        <tr className="">
          <td className="text-purple-500 text-right py-1">Full title:</td>
          <td className="py-1 pl-4">{project.title}</td>
        </tr>
        {/* <tr className="">
          <td className="text-purple-500 text-right py-1">Date created:</td>
          <td className="py-1 pl-4">{project.createdAt}</td>
        </tr> */}
        <tr className="">
          <td className="text-purple-500 text-right py-1">Admin:</td>
          <td className="py-1 pl-4">{adminInfo ? adminInfo.fullname : ''}</td>
        </tr>
        <tr className="">
          <td className="text-purple-500 text-right py-1">Persona:</td>
          <td className="py-1 pl-4">{project.totalPersonae}</td>
        </tr>
        <tr className="">
          <td className="text-purple-500 text-right py-1">Modules:</td>
          <td className="py-1 pl-4 text-xs">{parseModules()}</td>
        </tr>
      </thead>
    </table>
  )
}