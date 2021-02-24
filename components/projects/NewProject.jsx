import { SVGKey } from "@components/SVGIcon"
import fetchJson from "@lib/fetchJson"
import { useClients } from "@lib/hooks/client"
import useUser from "@lib/hooks/useUser"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import GroupSetup from "./GroupSetup"
import NewProjectForm from "./NewProjectForm"

export default function NewProject() {
  const { user } = useUser()
  const [createdProject, setCreatedProject] = useState(null)

  function masthead() {
    const now = new Date().toLocaleString()

    return (
      <div className="text-xs font-mono">
        <span className="bg-indigo-400 text-white rounded-l-full inline-block pl-3 pr-2 py-1">
          {user?.fullname}
        </span>
        <span className="bg-indigo-400 border-l border-indigo-500 text-white rounded-r-full inline-block px-3 py-1">
          {now.substr(0, now.indexOf(','))}
        </span>
      </div>
    )
  }

  if (createdProject) return <ProjectCreated project={createdProject} />

  return (
    <PageSkeleton
      title="New ACES Project"
      masthead={masthead()}
    >
      <NewProjectForm callback={setCreatedProject} />
    </PageSkeleton>
  )
}

function PageSkeleton({ children, ...props }) {
  useEffect(() => {
    const elm = document.getElementById('new-project')
    const top = elm.offsetTop
    elm.style.minHeight = `calc(100vh - ${top}px)`
  }, [])

  return (
    <div
      id="new-project"
      className="bg-indigo-100 bg-opacity-75 bg-gradient-to-t from-white -mb-24">
      <div className="aces-wrap bg-white pt-12 pb-16 border-b border-indigo-100">
        <div className="aces-geist">
          <div className="max-w-xl mx-auto text-center sm:text-left">
            <div className="text-2xl text-indigo-500 mb-2">
              {props.title}
            </div>
            {props.masthead}
          </div>
        </div>
      </div>
      <div className="aces-wrap">
        <div className="aces-geist py-12">
          <div className="max-w-xl mx-auto px-2 sm:px-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCreated({ project }) {
  const router = useRouter()

  function masthead() {
    return (
      <div className="text-sm text-gray-500">
        <div className="">
          <span className="inline-block w-auto sm:w-12">Title:</span>
          <span className="text-gray-800 font-medium ml-2">{project.title}</span>
        </div>
        <div className="">
          <span className="inline-block w-auto sm:w-12">Client:</span>
          <span className="text-gray-800 font-medium ml-2">{project.clientName}</span>
        </div>
        <p className="mt-3">
          Lakukan pemilihan modul-modul ACES yang akan dijalankan dalam proyek
          ini. Hanya setelah modul terinstal, daftar peserta (persona) dapat
          dirtambahkan.
        </p>
      </div>
    )
  }

  return (
    <PageSkeleton
      title="ACES Project Created"
      masthead={masthead()}
    >
      <div className="rounded border border-purple-200 bg-white bg-opacity-100 p-4">
        <GroupSetup
          group={{
            projectId: project._id,
            groupName: 'Group 1',
            modules: []
          }}
          isEditing={false}
          callback={() => {
            router.push(`/projects/${project._id}`)
          }}
        />
      </div>
    </PageSkeleton>
  )
}