import PageLoading from "@components/PageLoading";
import PageNotFound from "@components/PageNotFound";
import { ArrowLeft } from "@components/SVGIcon";
import { useProject } from "@lib/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Overview() {
  const router = useRouter()
  const { pid } = router.query
  const { project, isLoading, isError } = useProject(pid)

  useEffect(() => {
    if (project) {
      const el = document.getElementById('overview')
      const h = el?.offsetTop
      el.style.height = `calc(100vh - ${h}px)`
    }
  }, [])

  if (isError) return <PageNotFound />

  if (isLoading) return <PageLoading />

  return (
    <>
      <Hero project={project} />
      <div id="overview" className="aces-wrap -mb-24 bg-gray-100 bg-opacity-20 bg-gradient-to-t from-white border-t border-gray-200">
        <div className="aces-geist">
          <ProjectCards project={project} />
        </div>
      </div>
    </>
  )
}

const Hero = ({ project }) => {
  return (
    <div className="aces-wrap bg-white py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex text-xs mb-3">
          <Link href="/projects">
            <a className="flex items-center text-gray-500 hover:text-green-600">
              <ArrowLeft className="w-4 h-4 mr-1"/>
              <span className="uppercase">Projects</span>
            </a>
          </Link>
        </div>
        <h2 className="text-3xl text-gray-800 leading-snug tracking-loose">
          {project.shortTitle}
        </h2>
        <div className="text-sms text-gray-600 mb-6">
          {project.client.name}, {project.client.city}
        </div>
        {/* <div className="text-sm text-gray-600">
          <span>Project admin: {project.admin}</span>
        </div> */}
      </div>
    </div>
  )
}

const ProjectCards = ({ project }) => {
  return (
    <>
    <div className="grid grid-cols-6 gap-6 mt-8">
      <div className="rounded col-span-6 md:col-span-3 border border-yellow-200 shadow-sm bg-white px-4 py-3">
        <h3 className="font-bold mb-2">Project</h3>
        <table className="w-full text-sm">
        <tbody>
            <tr className="align-top">
              <td className="py-1 w-16">Title:</td>
              <td className="py-1 pl-2">{project.title}</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Client:</td>
              <td className="py-1 pl-2">{project.client.name}</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Admin:</td>
              <td className="py-1 pl-2">{project.adminInfo.fullname}</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Peserta:</td>
              <td className="py-1 pl-2">102</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Modul:</td>
              <td className="py-1 pl-2">6</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Grup:</td>
              <td className="py-1 pl-2">2</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded col-span-6 md:col-span-3 border border-yellow-200 shadow-sm bg-white px-4 py-3">
        <h3 className="font-bold mb-2">Deployment</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="align-top">
              <td className="py-1 w-24">Access code:</td>
              <td className="py-1 pl-2">ACSDF</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Opening date:</td>
              <td className="py-1 pl-2">ACSDF</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Closing date:</td>
              <td className="py-1 pl-2">ACSDF</td>
            </tr>
            <tr className="align-top border-b">
              <td colSpan="2" className="pt-3 pb-1 font-bold">Project Guests</td>
            </tr>
            <tr className="align-top">
              <td className="py-1 w-16">Client:</td>
              <td className="py-1 pl-2">2</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Expert:</td>
              <td className="py-1 pl-2">6</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded col-span-6 md:col-span-2 border border-yellow-200 shadow-sm bg-white px-4 py-3">
        <h3 className="font-bold mb-2">Modules & Persona</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="align-top">
              <td className="py-1 w-28">Jumlah peserta:</td>
              <td className="py-1 pl-2">102</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Jumlah modul:</td>
              <td className="py-1 pl-2">6</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Jumlah grup:</td>
              <td className="py-1 pl-2">2</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded col-span-6 md:col-span-2 border border-yellow-200 shadow-sm bg-white px-4 py-3">
        <h3 className="font-bold mb-2">Guests</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="align-top">
              <td className="py-1 w-16">Client:</td>
              <td className="py-1 pl-2">2</td>
            </tr>
            <tr className="align-top">
              <td className="py-1">Expert:</td>
              <td className="py-1 pl-2">6</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded col-span-6 md:col-span-2 border border-yellow-200 shadow-sm bg-white px-4 py-3">
        <h3 className="font-bold mb-2">Deployment</h3>
      </div>
    </div>
    <hr className="mt-8 mb-6 border-green-400"/>
    <p className="text-sm text-pink-500">
      &rarr; Perlu masukan tentang what should be prensented here and in what manner.
    </p>
    </>
  )
}