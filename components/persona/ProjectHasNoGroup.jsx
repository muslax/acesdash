import PageLoading from "@components/PageLoading";
import { useUsers } from "@lib/hooks";
import useUser from "@lib/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Hero from "./Hero";

export default function ProjectHasNoGroup({ project }) {
  const { user } = useUser()
  const router = useRouter()
  const { pid } = router.query

  useEffect(() => {
    const elm = document.getElementById('project-has-no-group')
    const top = elm.offsetTop
    elm.style.minHeight = `calc(100vh - ${top - 20}px)`
  }, [user])

  // if (isLoading) return <PageLoading />

  return (
    <div
      id="project-has-no-group"
      className="bg-yellow-50 bg-opacity-50 bg-gradient-to-t from-white -mb-24">
      <Hero
        subTitle1={project.title}
        subTitle2={project.client.name}
        isForm
      />
      <div className="aces-wrap border-t border-gray-200">
        <div className="aces-geist py-8">
          <div className="max-w-xl mx-auto text-center md:text-left">
            <div className="text-xl text-green-600 mb-4">
              Daftar peserta belum dapat ditambahkan
            </div>
            <p className="text-sm text-gray-600 px-6 md:px-0 mb-8">
              Hanya dapat menambahkan peserta ketika proyek sudah memiliki
              modul ACES yang akan dijalankan.
            </p>
            <p className="text-sms">
              <Link href={`/projects/${pid}/modules`}>
                <a className="text-blue-500">
                  &rarr; Siapkan modul ACES
                </a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}