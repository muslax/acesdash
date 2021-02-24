import PageLoading from "@components/PageLoading"
import PageNotFound from "@components/PageNotFound"
import { useProject } from "@lib/hooks"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { createIndonesiaDate } from '@lib/utils'
import fetchJson from "@lib/fetchJson"
// const moment = require('moment')


const DStatus = {
  NOT_READY: 'Not ready',
  READY: 'Ready to deploy',
  DEPLOYED: 'Deployed',
}

export default function Deployment({ user }) {
  const router = useRouter()
  const { pid } = router.query
  const { project, isLoading, isError, mutate } = useProject(pid)

  const [isDeployable, setIsDeployable] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const [openingDate, setOpeningDate] = useState(null)
  const [closingDate, setClosingDate] = useState(null)

  useEffect(() => {
    if (project) {
      setIsDeployed(
        project.openingDate && project.closingDate && project.accessCode
      )
      setIsDeployable(
        project.groups.length > 0 && project.totalPersonae > 0
      )

      if (project.openingDate) {
        setOpeningDate(createIndonesiaDate(project.openingDate))
      }

      if (project.closingDate) {
        setClosingDate(createIndonesiaDate(project.closingDate))
      }
    }
  }, [project])

  if (isLoading) return <PageLoading />

  if (isError) return <PageNotFound />

  const isAdmin = user.username === project?.admin
  const isReadyToDeploy = isDeployable && !isDeployed

  const statusText = isDeployed ? DStatus.DEPLOYED : (isDeployable ? DStatus.READY : DStatus.NOT_READY)

  return (
    <div className="-mt-2">
      <div className="flex items-center border-bs border-gray-200 pb-2 mb-2">
        <div className="flex-grow text-2xl text-green-600">
          Project Deployment
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-5">
        <DeploymentStatus status={statusText} />
      </div>
      {!isDeployable &&  <ProjectNotReady />}
      {isDeployed && <DeploymentInfo project={project} />}
      {isReadyToDeploy && isAdmin && <DeploymentForm project={project} mutate={mutate} />}
      {isReadyToDeploy && !isAdmin && (
        <p className="text-sm text-gray-600">
          Hanya administartor proyek yang dapat melakukan deployment.
        </p>
      )}
      <pre>
        {/* {JSON.stringify(project, null, 2)} */}
      </pre>
    </div>
  )
}

function DeploymentForm({ project, mutate }) {
  const [openingDate, setOpeningDate] = useState(null)
  const [closingDate, setClosingDate] = useState(null)
  const [accessCode, setAccessCode] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function isReady() {
    return openingDate && closingDate && accessCode && closingDate >= openingDate
  }

  async function submitDeployment() {
    setSubmitting(true)

    const body = {
      projectId: project._id,
      openingDate: new Date(openingDate + 'T01:00:00.000+07:00'),
      closingDate: new Date(closingDate + 'T23:00:00.000+07:00'),
      accessCode: project.license + '-' + accessCode,
    }

    console.log(body)
    const url = `/api/post?q=set-deployment`
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (response) {
      mutate()
    }
  }

  const inputClass = "text-sm px-2 py-1 rounded-sm border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"

  return (
    <div className="max-w-lg text-sm text-gray-600 rounded border border-gray-400 shadow-sm px-4 py-2">
        <p className="text-base text-gray-600 font-bold -mx-4 px-4 pb-2 border-b border-gray-300 mb-4">
          Deployment Notes
        </p>
        <ul className="mb-4">
          <li className="list-disc ml-4 pl-2">
            Deployment info tidak bisa diubah setelah tersimpan.
          </li>
          <li className="list-disc ml-4 pl-2">
            Konfigurasi grup dan modul tidak lagi dapat diubah.
          </li>
          <li className="list-disc ml-4 pl-2">
            Penambahan daftar peserta hanya dapat dilakukan secara manual.
          </li>
          <li className="list-disc ml-4 pl-2">
            <span className="text-purple-500 font-semibold">Tanggal mulai</span> berlaku
            efektif mulai Pukul 01:00 WIB.
          </li>
          <li className="list-disc ml-4 pl-2">
            <span className="text-purple-500 font-semibold">Tanggal selesai</span> berakhir
            efektif pada Pukul 23:00 WIB.
          </li>
          <li className="list-disc ml-4 pl-2">
            Bila browser tidak memunculkan widget kalender, tanggal mulai dan
            tanggal selesai harus ditulis dalam format{` `}
            <span className="text-purple-500 font-semibold">yyyy-mm-dd</span>
          </li>
          <li className="list-disc ml-4 pl-2">
            Kode akses yang Anda masukkan (minimal 3 huruf/angka) akan disimpan
            dengan penambahan awalan kode lisensi dan tanda minus. {project.license}
          </li>
        </ul>
        {/*  */}
        <div className="border-t border-gray-300 -mx-4 px-4 py-3">
          <table className="w-full text-sm">
            <tbody>
              <tr className="">
                <td className="w-16 p-2 pl-0">Tanggal&nbsp;mulai:</td>
                <td className="p-2">
                  <input
                    type="date"
                    placeholder="yyyy-mm-dd"
                    onChange={e => {
                      if (createIndonesiaDate(e.target.value)) {
                        setOpeningDate(e.target.value)
                      }
                    }}
                    className={`w-32 ${inputClass}`}
                  />
                </td>
                <td className="p-2 text-right text-green-600">
                  {openingDate ? createIndonesiaDate(openingDate).tanggal : ''}
                </td>
              </tr>
              <tr className="border-ts">
                <td className="p-2 pl-0">Tanggal&nbsp;selesai:</td>
                <td className="p-2">
                  <input
                    type="date"
                    placeholder="yyyy-mm-dd"
                    onChange={e => {
                      if (createIndonesiaDate(e.target.value)) {
                        setClosingDate(e.target.value)
                      }
                    }}
                    className={`w-32 ${inputClass}`}
                  />
                </td>
                <td className="p-2 text-right text-green-600">
                  {closingDate ? createIndonesiaDate(closingDate).tanggal : ''}
                </td>
              </tr>
              <tr className="border-ts">
                <td className="p-2 pl-0">Kode&nbsp;Akses:</td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="min. 3 karakter"
                    onChange={e => {
                      if(e.target.value.trim().length > 2) {
                        setAccessCode(e.target.value.trim())
                      } else {
                        setAccessCode('')
                      }
                    }}
                    className={`w-32 ${inputClass}`}
                  />
                </td>
                <td className="p-2 text-right text-green-600 font-bold">
                  {accessCode ? `${project.license}-${accessCode}` : ''}
                </td>
              </tr>
              <tr className="border-ts">
                <td className="p-2 pl-0"></td>
                <td className="p-2 pt-4">
                  {!isReady() && <button
                    disabled
                    className="inline-flex items-center text-gray-400 justify-center text-sm font-semibold px-5 py-2 rounded border border-gray-300"
                  >
                    Deploy Project
                  </button>}
                  {isReady() && <button
                    onClick={submitDeployment}
                    className="inline-flex items-center justify-center text-sm font-semibold px-5 py-2 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    Deploy Project
                  </button>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  )
}

function ProjectNotReady() {
  return (
    <div className="max-w-xl text-sm text-gray-600">
      Untuk dideploy, proyek harus sudah memiliki sejumlah modul dan daftar peserta.
    </div>
  )
}

function DeploymentInfo({ project }) {
  const openingDate = createIndonesiaDate(project.openingDate)
  const closingDate = createIndonesiaDate(project.closingDate)

  return (
    <div className="max-w-xl rounded border border-gray-400 shadow-sm px-4 py-2">
      <div className="text-purple-600 font-medium mb-4">
        Deployment Info
      </div>
      <table className="w-full text-sm">
        <tbody>
          <tr>
            <td className="w-20 p-2 pl-0">Mulai:</td>
            <td className="p-2">
              {openingDate.hari}, {openingDate.tanggal}, Pukul {openingDate.waktu} WIB
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-2 pl-0">Sampai:</td>
            <td className="p-2">
            {closingDate.hari}, {closingDate.tanggal}, Pukul {closingDate.waktu} WIB
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-2 pl-0">Kode&nbsp;Akses:</td>
            <td className="p-2">
              <span className="text-purple-500 font-bold">{project.accessCode}</span>
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-2 pl-0">Deployment&nbsp;URL:</td>
            <td className="p-2">
              <a href="#" className="text-blue-500">http://alamat.test.online</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function DeploymentStatus({ status }) {
  const bgColor = status == DStatus.READY ? 'green-500' : (status === DStatus.NOT_READY ? 'gray-400' : 'purple-500')
  return (
    <div className="inline-flex text-xss leading-none font-medium uppercase">
      <div className="bg-gray-200 rounded-l-full text-gray-700 pl-2 pr-1 py-1">
      &nbsp;Status&nbsp;
      </div>
      <div className={`bg-${bgColor} rounded-r-full text-white uppercase font-medium pl-2 pr-3 py-1`}>
        {status}
      </div>
    </div>
  )
}