import PageLoading from "@components/PageLoading";
import { useUsers } from "@lib/hooks";
import useUser from "@lib/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Hero from "./Hero";

export default function ProjectHasNoPersona({ project }) {
  const { user } = useUser()
  // const router = useRouter()
  // const { pid } = router.query

  useEffect(() => {
    const elm = document.getElementById('project-has-no-group')
    const top = elm.offsetTop
    elm.style.minHeight = `calc(100vh - ${top - 20}px)`
  }, [user])

  // if (isLoading) return <PageLoading />

  const isAdmin = user?.username == project.admin

  return (
    <div
      id="project-has-no-group"
      className="bg-yellow-100 bg-opacity-25 bg-gradient-to-t from-white -mb-24">
      <Hero
        subTitle1={project.title}
        subTitle2={project.client.name}
        isForm
      />
      <div className="aces-wrap border-t border-gray-200">
        <div className="aces-geist py-8">
          <div className="max-w-xl mx-auto text-center md:text-left">
            <div className="text-xl text-green-600 mb-4">
              Siap menambahkan daftar peserta
            </div>
            <p className="text-sm text-gray-600 px-6 md:px-0 mb-8">
              Data peserta dapat ditambahkan satu per satu atau per grup dengan
              mengunggah berkas peserta dalam format CSV. Template berkas CSV
              dapat diunduh melalui tautan di bawah ini.
            </p>
            <p className="text-sm mb-6">
              <Link href={`/persona-sample.csv`}>
                <a download target="_blank" className="text-blue-500">
                  &rarr; Unduh template berkas CSV
                </a>
              </Link>
            </p>
            <p className="text-sm mb-6">
              {!isAdmin && (
                <span className="text-gray-600">
                  Daftar peserta hanya dapat ditambahkan oleh administrator proyek.
                </span>
              )}
              {isAdmin && (
                <>
                  <Link href={`/projects/${project?._id}/persona?task=add`}>
                    <a className="inline-flex text-sm px-5 py-2 hover:bg-white focus:outline-none hover:shadow-sm rounded border border-gray-300 hover:border-gray-400 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">Add</a>
                  </Link>
                  <Link href={`/projects/${project?._id}/persona?task=import`}>
                    <a className="inline-flex text-sm ml-3 px-5 py-2 hover:bg-white focus:outline-none hover:shadow-sm rounded border border-gray-300 hover:border-gray-400 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">Import CSV</a>
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}