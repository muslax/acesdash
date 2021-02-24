import PageLoading from "@components/PageLoading"
import { SVGGear } from "@components/SVGIcon"
import fetchJson from "@lib/fetchJson"
import { useProject } from "@lib/hooks"
import { createIndonesiaDate } from "@lib/utils"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Info({ user }) {
  const router = useRouter()
  const { pid } = router.query
  const { project, isLoading, isError, mutate } = useProject(pid)

  const [view, setView] = useState(null)

  if (isError) return <>Error</>

  if (isLoading) return <PageLoading />

  const isAdmin = user.username === project.admin

  return (
    <div className="-mt-2">
      <div className="flex items-center border-bs border-gray-200 pb-2 mb-2">
        <div className="flex-grow text-2xl text-green-600">
          Project Info
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-5">
        Informasi proyek dan klien hanya dapat diedit oleh administartor proyek.
      </div>
      {!view && (
        <ProjectInfo
          project={project}
          canEdit={isAdmin}
          setView={e => setView('update-info')}
        />
      )}
      {view === 'update-info' && (
        <FormProjectInfo
          project={project}
          callback={() => {
            mutate()
            setView(null)
          }}
        />
      )}
      <pre>
        {/* {JSON.stringify(project.client, null, 2)} */}
      </pre>
    </div>
  )
}

function ProjectInfo({ project, canEdit, setView }) {
  return (
    <div className="max-w-xl mx-auto sm:mx-0">
      <div className="rounded border border-gray-400 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-beige border-b border-gray-400 align-top">
              <td className="w-24 bg-gray-100 font-bold leading-relaxed py-2 px-4">
                Administrative
              </td>
              <td className="bg-gray-100 pt-2 px-3 text-right align-middle">
                {!canEdit && <button
                  className="inline-flex text-gray-300"
                >
                  <SVGGear className="w-5 h-5" />
                </button>}
                {canEdit && <button
                  className="inline-flex text-gray-500 hover:text-green-600"
                  onClick={setView}
                >
                  <SVGGear className="w-5 h-5" />
                </button>}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b align-top">
              <td className="p-2 pl-4 whitespace-nowrap text-right">Project ID:</td>
              <td className="p-2 pr-4">{project._id}</td>
            </tr>
            <FieldRow label="Project title" value={project.title} style="font-semibold" />
            <FieldRow label="Short title" value={project.title} />
            <FieldRow label="Description" value={project.description} />
            <FieldRow
              label="Start date"
              value={createIndonesiaDate(project.startDate).tanggal}
            />
            <FieldRow
              label="End date"
              value={createIndonesiaDate(project.endDate).tanggal}
            />
            <tr className="border-bs align-top">
              <td className="p-2 pl-4 whitespace-nowrap text-right">Project admin:</td>
              <td className="p-2 pr-4">{project.adminInfo.fullname}</td>
            </tr>

            <FieldGroup label="Client & Contact" />
            <FieldRow label="Company name" value={project.client.name} style="font-semibold" />
            <FieldRow label="Address" value={project.client.address || 'N/A'} />
            <FieldRow label="City" value={project.client.city} />
            <FieldRow label="Phone" value={project.client.phone || 'N/A'} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

const createModel = (project) => {
  let startDate = ''
  let endDate = ''
  if (!isNaN(Date.parse(project.startDate))) {
    startDate = project.startDate.substr(0, 10)
  }
  if (!isNaN(Date.parse(project.endDate))) {
    endDate = project.endDate.substr(0, 10)
  }
  return {
    _id: project._id,
    title: project.title,
    shortTitle: project.shortTitle,
    description: project.description,
    startDate: startDate,
    endDate: endDate
  }
}

function FormProjectInfo({ project, callback }) {
  const [model, setModel] = useState(createModel(project))
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function setValue(e) {
    const field = e.target.name
    const value = e.target.value
    setModel(prev => ({
      ...prev,
      [field]: value
    }))
    setConfirmed(false)
  }

  function setTitle(e) {
    const value = e.target.value
    setModel(prev => ({
      ...prev,
      title: value
    }))

    setConfirmed(false)
    if (value.length <= 36) {
      setModel(prev => ({...prev, shortTitle: value}))
    } else {
      const tmp = value.substr(0, 32) + '...'
      setModel(prev => ({...prev, shortTitle: tmp}))
    }
  }

  function isReady() {
    return model?.title && model?.shortTitle &&  model?.description &&
    !isNaN(Date.parse(model?.startDate)) && !isNaN(Date.parse(model?.endDate))
  }

  async function saveProject(e) {
    setSubmitting(true)

    const body = model
    console.log(body);
    // return


    const url = '/api/post?q=update-project'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })

    // Optimistic
    if (response) {
      callback(response)
    }
  }

  const inputStyle = "px-2 py-2 mr-4 inline-flex text-sm leading-none rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 hover:border-indigo-300 focus:ring focus:ring-indigo-50"
  return (
    <div className="max-w-xl mx-auto sm:mx-0">
      <div className="rounded border border-gray-400 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-gray-600">
          <thead>
            <tr className="bg-beige border-b border-gray-400 align-top">
              <td className="w-24 bg-gray-100 font-bold leading-relaxed py-2 px-4">
                Administrative
              </td>
              <td className="bg-gray-100 pt-2 px-3 text-right align-middle">
                &nbsp;
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="">
              <td className="p-2 pt-5 whitespace-nowrap text-xs uppercase text-right text-gray-500">Project ID:</td>
              <td className="p-2 pt-5 pr-5">
                <input
                  disabled
                  name="title"
                  type="text"
                  value={project._id}
                  className="px-2 py-2 block w-56 bg-gray-50 text-sm leading-none rounded-sm border-gray-300"
                />
              </td>
            </tr>
            <tr className="">
              <td className="p-2 whitespace-nowrap text-xs uppercase text-right text-gray-500">Project title:</td>
              <td className="p-2 pr-5">
                <input
                  name="title"
                  type="text"
                  value={model.title}
                  className={'w-full ' + inputStyle}
                  onChange={setTitle}
                />
              </td>
            </tr>
            <tr className="">
              <td className="p-2 whitespace-nowrap text-xs uppercase text-right text-gray-500">Short title:</td>
              <td className="p-2 pr-5">
                <input
                  name="shortTitle"
                  type="text"
                  maxLength="36"
                  value={model.shortTitle}
                  onChange={setValue}
                  disabled={model.title.length <= 36}
                  className={'w-full ' + inputStyle}
                />
              </td>
            </tr>
            <tr className="align-top">
              <td className="p-2 pt-4 whitespace-nowrap text-xs uppercase text-right text-gray-500">Description:</td>
              <td className="p-2 pr-5">
                <textarea
                  rows="3"
                  name="description"
                  value={model.description}
                  onChange={setValue}
                  className="px-2 py-2 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
              </td>
            </tr>
            <tr className="">
              <td className="p-2 whitespace-nowrap text-xs uppercase text-right text-gray-500">Start/end date:</td>
              <td className="p-2 pr-5">
                <input
                  name="startDate"
                  type="text"
                  placeholder="yyyy-mm-dd"
                  value={model.startDate}
                  className={'w-32 ' + inputStyle}
                  onChange={setValue}
                />
                <input
                  name="endDate"
                  type="text"
                  placeholder="yyyy-mm-dd"
                  value={model.endDate}
                  className={'w-32 ' + inputStyle}
                  onChange={setValue}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="px-5 py-3">
                {!submitting && <div className="h-2 rounded-full border"></div>}
                {submitting && <div
                  className="h-2 rounded-full border border-gray-400"
                  style={{ backgroundImage: 'url(/mango-in-progress-01.gif)' }}
                ></div>}
              </td>
            </tr>
            <tr className="">
              <td className=""></td>
              <td className="pl-2 pt-2 pr-5 pb-6">
                {!isReady() && <button
                  disabled
                  className="inline-flex items-center text-sm text-gray-400 font-semibold px-6 py-2 focus:outline-none rounded border border-gray-300 shadow-sm"
                >
                  Save Project
                </button>}
                {isReady() && <button
                  onClick={e => saveProject()}
                  className="inline-flex items-center text-sm font-semibold px-6 py-2 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-purple-400 focus:tex-purple-600 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                >
                  Save Project
                </button>}
                <button
                  onClick={callback}
                  className="inline-flex items-center text-sm font-semibold ml-3 px-6 py-2 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-purple-400 focus:tex-purple-600 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                >
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FieldGroup({ label }) {
  return (
    <tr className="bg-gray-100 border-t border-b border-gray-400 border-opacity-50 align-top">
      <td colSpan="2" className="font-bold leading-relaxed py-2 px-4">
        {label}
      </td>
    </tr>
  )
}

function FieldRow({ label, value, style = '' }) {
  return (
    <tr className="border-b align-top">
      <td className="p-2 pl-4 whitespace-nowrap text-gray-500 text-right">{label}:</td>
      <td className={`text-gray-700 p-2 pr-4 ${style}`}>{value}</td>
    </tr>
  )
}