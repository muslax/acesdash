import PageLoading from "@components/PageLoading"
import { useProjectSimpleInfo } from "@lib/hooks"
import useUser from "@lib/hooks/useUser"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import FormPersona from "./FormPersona"
import Hero from "./Hero"

export default function AddPersona() {
  const { user } = useUser()
  const router = useRouter()
  const { pid } = router.query
  const { projectSimpleInfo, isLoading, isError } = useProjectSimpleInfo(pid)

  const [person, setPerson] = useState(null)

  // if (!user || isLoading) return <PageLoading />

  useEffect(() => {
    if (user && projectSimpleInfo) {
      const elm = document.getElementById('add-persona')
      const top = elm?.offsetTop
      elm.style.minHeight = `calc(100vh - ${top}px)`
    }
  }, [user, projectSimpleInfo])

  if (!user || isLoading) return <PageLoading />

  if (user.username !== projectSimpleInfo?.admin) {
    router.push(`/projects/${pid}/persona`)
  }

  return (
    <div
      id="add-persona"
      className="bg-gray-50 bg-opacity-25 bg-gradient-to-t from-gray-300 -mb-24">
      <Hero
        title="New ACES Persona"
        subTitle1={projectSimpleInfo.title}
        subTitle2={projectSimpleInfo.client.name}
        isForm
      />
      <div className="aces-wrap border-t border-gray-200">
        <div className="aces-geist py-12">
          <div className="max-w-xl mx-auto">
            {person && <NewCreatedPersona pid={pid} person={person} />}
            {!person && <FormPersona pid={pid} onSuccess={setPerson} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function NewCreatedPersona({ pid, person }) {
  return (
    <div className="bg-white rounded border border-gray-300 shadow-sm text-center p-4 px-5">
      <div className="text-xl text-gray-700 font-bold mt-2 mb-5">Persona data saved</div>
      <div className="bg-blue-200 -mx-5 px-5 px-12 sm:px-20 pt-4 pb-5">
        <div className="grid grid-cols-5 text-sm">
          <div className="col-span-2 text-right px-2 py-1">Nama lengkap:</div>
          <div className="col-span-3 text-left font-bold px-1 py-1">{person.fullname}</div>
          <div className="col-span-2 text-right px-2 py-1">Email:</div>
          <div className="col-span-3 text-left font-bold px-1 py-1">{person.email}</div>
          <div className="col-span-2 text-right px-2 py-1">Username:</div>
          <div className="col-span-3 text-left font-bold px-1 py-1">{person.username}</div>
          <div className="col-span-2 text-right px-2 py-1">Password:</div>
          <div className="col-span-3 text-left font-bold px-1 py-1">{person.password}</div>
        </div>
      </div>
      <div className="pt-8 pb-2">
        <Link href={`/projects/${pid}/persona`}>
          <a className="inline-flex text-sm px-3 py-1 focus:outline-none rounded border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            Done
          </a>
        </Link>
        <button
          onClick={e => setPerson(null)}
          className="text-sm ml-2 px-3 py-1 focus:outline-none rounded border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          Create New
        </button>
      </div>
    </div>
  )
}