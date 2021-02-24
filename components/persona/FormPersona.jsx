import { useEffect, useState } from "react"
import { PersonaModel } from '@lib/models'
import { useProjectGroups } from "@lib/hooks"
import Link from "next/link"
import useUser from "@lib/hooks/useUser"
import fetchJson from "@lib/fetchJson"


export default function FormPersona({ pid, onSuccess }) {
  const { user } = useUser()
  const { groups } = useProjectGroups(pid, [
    'groupName',
    'modules.metaId',
    'modules.method',
    'modules.moduleName',
  ])

  const [model, setModel] = useState(PersonaModel)
  const [created, setCreated] = useState(null)
  const [modules, setModules] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [usernameMsg, setUsernameMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setModel(prv => ({
      ...prv,
      projectId: pid,
      license: user.license,
    }))
    return () => {}
  }, [groups])

  useEffect(() => {
    let array = []
    let tests = []
    let sims = []

    modules.forEach(mod => {
      array.push( mod.metaId )
      if (mod.method === 'selftest') tests.push(mod.metaId)
      if (mod.method === 'guided') sims.push(mod.metaId)
    })

    setModel(prv => ({
      ...prv,
      tests: tests,
      sims: sims,
    }))
    return () => {}
  }, [modules])

  async function handleSubmit(e) {
    setSubmitting(true)

    // setStep(1)
    // window.scrollTo(0, 0)
    // setModel(Persona)
    // setModel(prv => ({
    //   ...prv,
    //   projectId: pid,
    //   license: project.license,
    // }))
    // setModules([])

    const body = model
    console.log('model', model)
    const url = '/api/post?q=create-persona'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(model)
    })

    if (response.person) {
      onSuccess(response.person)
    }
  }

  async function checkUsername(e) {
    const value = e.target.value.toLowerCase()
    const url = `/api/get?q=check-username&pid=${pid}&find=${value}`

    if (value.length > 4) {
      const response = await fetchJson(url)

      if (!response._id) {
        setModel(prv => ({ ...prv, username: value}))
        setUsernameMsg('OK')
      } else {
        setModel(prv => ({ ...prv, username: ''}))
        setUsernameMsg('Username sudah terpakai')
        document.querySelector('input[type="checkbox"]').checked = false
      }
    } else {
      setModel(prv => ({ ...prv, username: ''}))
      setUsernameMsg('...')
      document.querySelector('input[type="checkbox"]').checked = false
    }

  }

  function handleGroupChange(e) {
    const val = e.target.value
    setModel(prv => ({ ...prv, group: val}))
    let filtered = groups.filter(g => g._id == val)
    setModules( filtered.length > 0 ? filtered[0].modules : [] )
    document.querySelector('input[type="checkbox"]').checked = false
  }

  function isReady() {
    return model.fullname && model.username && model.group && usernameMsg == 'OK'
  }

  return (
    <div className="rounded shadow bg-white border border-gray-400 border-opacity-50 overflow-hidden text-sm px-6 mb-12">
    <pre>
      {/* {JSON.stringify(modules, null, 2)} */}
    </pre>
      <div className="-mx-6 px-6 py-3 bg-gray-100 mb-4">
        <div className="text-gray-600 uppercase font-medium">
          Data personal
        </div>
      </div>

      <table className="w-full text-sm text-gray-600 mb-6">
        <tbody>
          <tr><td width="28%"></td><td></td></tr>
          <DataRow label="Nama lengkap" field="fullname" setter={setModel} />
          <tr className="">
            <td className="py-1 whitespace-nowrap">Username:</td>
            <td className="py-1 pl-3">
              <div className="flex items-center">
                <input
                  onChange={checkUsername}
                  onBlur={e => {
                    if (e.target.value.trim().length < 5) {
                      setUsernameMsg('Minimal 5 karakter')
                    }
                  }}
                  type="text"
                  className="inline-flex mt-1 w-36 rounded px-2 py-1 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {usernameMsg == 'OK' && <span className="text-sm text-green-600 pt-1 ml-3">{usernameMsg}</span>}
                {usernameMsg && usernameMsg != 'OK' && <span className="text-sm text-red-500 pt-1 ml-3">{usernameMsg}</span>}
              </div>
            </td>
          </tr>

          <tr className="">
            <td className="py-1 whitespace-nowrap">Jenis kelamin:</td>
            <td className="py-1 pl-3">
              <select onChange={e => {
                setModel(prv => ({ ...prv, gender: e.target.value}))
              }}
              className="mt-1 block px-2 pr-10 py-1 rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="">-</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </td>
          </tr>
          <tr className="">
            <td className="py-1 whitespace-nowrap">Tanggal lahir:</td>
            <td className="py-1 pl-3">
              <input onChange={e => {
                setModel(prv => ({ ...prv, birth: e.target.value}))
              }}
              type="date" className="mt-1 block w-fulls rounded px-2 py-1 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
            </td>
          </tr>
          <DataRow label="Email" field="email" xref="email" setter={setModel} />
          <DataRow label="Telepon / HP" field="phone" setter={setModel} />
        </tbody>
      </table>

      <div className="-mx-6 px-6 py-3 bg-gray-100 mb-4">
        <div className="text-gray-600 uppercase font-medium">
          Data profesional
        </div>
      </div>

      <table className="w-full text-sm text-gray-600 mb-6">
        <tbody>
          <tr><td width="28%"></td><td></td></tr>
          <DataRow label="Nomor induk" field="nip" setter={setModel} />
          <DataRow label="Jabatan/posisi" field="position" setter={setModel} />
          <DataRow label="Level sekarang" field="currentLevel" setter={setModel} />
          <DataRow label="Level ditargetkan" field="targetLevel" setter={setModel} />
        </tbody>
      </table>

      <div className="-mx-6 px-6 py-3 bg-gray-100 mb-4">
        <div className="text-gray-600 uppercase font-medium">
          Group & modules
        </div>
      </div>

      <table className="w-full text-sm text-gray-600">
        <tbody>
          <tr><td width="28%"></td><td></td></tr>
          <tr className="">
            <td className="py-1 whitespace-nowrap">Pilih batch/grup:</td>
            <td className="py-1 pl-3">
              <select onChange={e => {
                const val = e.target.value
                setModel(prv => ({ ...prv, group: val}))
                let filtered = groups.filter(g => g._id == val)
                setModules( filtered.length > 0 ? filtered[0].modules : [] )
                document.querySelector('input[type="checkbox"]').checked = false
              }}
              className="mt-1 inline-block px-2 pr-10 py-1 rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="">-</option>
                {groups?.map(({ _id, groupName}) => (
                  <option key={_id} value={_id}>{groupName}</option>
                ))}
              </select>
            </td>
          </tr>
          <tr className="align-top">
            <td className="py-1 whitespace-nowrap"></td>
            <td className="pt-2 pl-3">
              {modules?.map(({metaId, moduleName }) => (
              <div key={metaId} className="mb-1">
                &bull; {moduleName}
              </div>
              ))}
            </td>
          </tr>
          <tr className="">
            <td colSpan="2" className="h-8">
              {submitting &&
                <div
                  className="h-1 rounded-full border border-gray-400"
                  style={{
                    backgroundImage: "url(/mango-in-progress-01.gif)"
                  }}
                ></div>
              }
            </td>
          </tr>
          <tr>
            <td></td>
            <td className="pt-2 pb-1 pl-3">
              <label className="inline-flex items-center mb-3">
                <input
                  disabled={!isReady()}
                  onChange={e => {
                    setConfirmed(e.target.checked)
                  }}
                  // defaultChecked={isReady()}
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:rings focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="ml-2">Confirm to save</span>
              </label>
              <div className="mb-6">
                <button
                  onClick={handleSubmit}
                  disabled={!confirmed}
                  className="text-sm px-4 py-2 focus:outline-none rounded border border-gray-400 shadow-sm focus:border-green-400 hover:shadow active:bg-green-600 active:border-green-600 active:text-white focus:ring focus:ring-green-300 focus:ring-opacity-50"
                >Save Persona</button>
                <Link href={`/projects/${pid}/persona`}>
                  <a className="inline-block text-sm ml-2 px-4 py-2 focus:outline-none rounded border border-gray-400 shadow-sm focus:border-indigo-300 hover:shadow active:bg-indigo-400 active:border-indigo-400 active:text-white focus:ring focus:ring-indigo-200 focus:ring-opacity-50">Cancel</a>
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function DataRow({ field, label, setter, xref, width="", maxLength="" }) {
  const length = parseInt(maxLength) > 0 ? parseInt(maxLength) : false

  return (
    <tr className="">
      <td className="py-1 whitespace-nowrap">{label}:</td>
      <td className="py-1 pl-3">
        <input id={xref} maxLength={length ? length : ''} type="text" onChange={e => {
          setter(prev => ({
            ...prev, [field]: e.target.value
          }))
        }}
        className="mt-1 block w-full px-2 py-1 rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </td>
    </tr>
  )
}