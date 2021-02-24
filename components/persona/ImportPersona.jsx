import PageLoading from "@components/PageLoading"
import PageNotFound from "@components/PageNotFound"
import fetchJson from "@lib/fetchJson"
import { useProjectGroups, useProjectSimpleInfo } from "@lib/hooks"
import useUser from "@lib/hooks/useUser"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { CSVReader } from 'react-papaparse'
import Hero from "./Hero"

const buttonRef = React.createRef()

export default function ImportPersona({ projectInfo }) {
  const { user } = useUser()
  const router = useRouter()
  const { pid } = router.query
  // const { projectSimpleInfo, isLoading: psiLoading, isError: psiError } = useProjectSimpleInfo(pid)
  const { groups, isLoading, isError } = useProjectGroups(pid, ['groupName', 'modules'])
  const [group, setGroup] = useState(null)
  const [csvData, setCsvData] = useState(null)
  const [personaData, setPersonaData] = useState([])
  const [testIds, setTestIds] = useState([])
  const [simIds, setSimIds] = useState([])
  const [confirmedToSave, setConfirmedToSave] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hashing, sethashing] = useState(false)
  const [hashingFlag, setHashingFlag] = useState(false)

  const [response, setResponse] = useState(null)
  const [counter, setCounter] = useState(0)
  const [CID, setCID] = useState(null)
  const [cTime, setCTime] = useState(null)

  /**
   * While user observing csv data, let bcryptjs
   * do the hashing on server (around 7 sec for 100 rows),
   * preventing ui lags.
   */
  const generateHashOnServer = async () => {
    sethashing(true)
    const url = '/api/post?q=check-and-prepare-csv'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(personaData)
    })

    if (response) {
      setPersonaData(response)
      sethashing(false)
    } else {
      // setResponse('FAILED')
    }
  }

  function populate (data) {
    setCsvData(data)
  }

  function reset () {
    setCsvData(null)
    setPersonaData([])
  }

  function handleOpenDialog (e) {
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  function handleOnFileLoad(data) {
    populate(data)
  }

  function handleOnError(err, file, inputElem, reason) {
    console.log(err);
  }

  function handleOnRemoveFile(data) {
    reset()
    console.log(data);
  }

  function handleRemoveFile(e) {
    document.querySelectorAll('input[type="checkbox]').forEach(elm => {
      elm.checked = true
    })

    document.querySelectorAll('.col-email, .col-gender, .col-birth, .col-phone, .col-nip, .col-position').forEach(elm => {
      elm.classList.remove('hidden')
    })

    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  }

  function getTestIds(groupId) {
    // setSelectedGroup(groupId)
    const filtered = groups.filter(g => g._id == groupId)
    if (filtered.length) {
      let ids = []
      filtered[0].modules.forEach(m => {
        if (m.method == 'selftest') ids.push(m.metaId)
      })
      return ids
    }

    return []
  }

  function getSimIds(groupId) {
    // setSelectedGroup(groupId)
    const filtered = groups.filter(g => g._id == groupId)
    if (filtered.length) {
      let ids = []
      filtered[0].modules.forEach(m => {
        if (m.method == 'guided') ids.push(m.metaId)
      })
      return ids
    }

    return []
  }

  async function handleSubmit(e) {
    setSubmitting(true)

    const body = {
      projectId: pid,
      license: user.license,
      group: group._id,
      // tests: testIds,
      // sims: simIds,
      personae: personaData
    }

    console.log('body.personae[3]', body.personae[3])
    // return

    const url = '/api/post?q=save-csv-data'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (response.created) {
      // setResponse('OK')
      // mutate(`/api/get?q=get-personae&pid=${project._id}`)
      router.push(`/projects/${pid}/persona`)
    } else {
      // setResponse('FAILED')
    }
  }

  function showHideCol(e) {
    const elms = document.querySelectorAll(`.${e.target.value}`)
    if (e.target.checked) {
      elms.forEach(elm => elm.classList.remove('hidden'))
    } else {
      elms.forEach(elm => elm.classList.add('hidden'))
    }
  }

  useEffect(() => {
    if (csvData && csvData.length > 1) {
      let array = []
      csvData.forEach(({ data }, index) => {
        if (data.length == 10 && data[0] && data[0].toLowerCase() !== 'fullname') {
          array.push({
            _id: null,
            license: user.license,
            projectId: pid,
            disabled: false,
            fullname: data[0],
            username: data[1].toLowerCase(),
            email: data[2],
            gender: data[3],
            birth: data[4],
            phone: data[5],
            nip: data[6],
            position: data[7],
            currentLevel: data[8],
            targetLevel: data[9],
            group: group._id,
            simGroup: '',
            tests: testIds,
            sims: simIds,
            currentTest: null,
            currentSim: null,
            testsPerformed: [],
            simsPerformed: [],
            hashed_password: null,
            createdBy: user.username,
            createdAt: new Date(),
            updatedAt: null,
            xfpwd: null,
          })
        }
      })

      setPersonaData(array)
      setHashingFlag(!hashingFlag)
    } else {
      setPersonaData([])
    }
    return () => {}
  }, [csvData])

  useEffect(() => {
    if (personaData) {
      generateHashOnServer()
    }
    return () => {}
  }, [hashingFlag])

  useEffect(() => {
    if (groups) {
      const elm = document.getElementById('import-csv')
      if (elm) {
        const top = elm.offsetTop
      elm.style.minHeight = `calc(100vh - ${top}px)`
      }
    }
  }, [groups])


  if (!user || isLoading) return <PageLoading />

  if (isError) return <PageNotFound />

  if (user.username !== projectInfo.admin) {
    router.push(`/projects/${pid}/persona`)
  }

  return (
    <div
      id="import-csv"
      className="bg-gray-50 bg-opacity-25 bg-gradient-to-t from-gray-300 -mb-24">
      <Hero
        title="Import CSV"
        subTitle1={projectInfo.title}
        subTitle2={projectInfo.client.name}
      />
      <div className="aces-wrap bg-white pb-3">
        <div className="aces-geist">
          <div className="">
            <CSVReader
              ref={buttonRef}
              onFileLoad={handleOnFileLoad}
              onError={handleOnError}
              noClick
              noDrag
              onRemoveFile={handleOnRemoveFile}
            >
              {({ file }) => (
                <>
                <div className="flex flex-row items-center pb-1">
                  <div className="flex items-center">
                    <select disabled={submitting}
                      onChange={e => {
                        const val = e.target.value
                          setTestIds( getTestIds(val) )
                          setSimIds( getSimIds(val) )
                        if (val) {
                          setGroup(groups.filter(g => g._id == val)[0])
                        } else {
                          // setTestIds([])
                          setGroup(null)
                        }
                      }}
                      className="text-sm mr-2 py-1 rounded border-gray-300 hover:border-gray-400 shadow-sm hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option value="">Pilih group</option>
                      {groups.map(({ _id, groupName }) => (
                        <option key={_id} value={_id}>{groupName}</option>
                      ))}
                    </select>
                    {!group && <button
                      type="button"
                      disabled
                      className="bg-white rounded border border-gray-300 whitespace-nowrap text-sm px-3 py-1 text-gray-400"
                    >
                      Pilih file
                    </button>}
                    {group && <button
                      type="button"
                      disabled={submitting}
                      onClick={handleOpenDialog}
                      className="bg-white whitespace-nowrap text-sm px-3 py-1 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      Pilih file
                    </button>}
                    <div className="w-64 bg-white border border-gray-300 text-sm px-2 py-1 mx-3">
                      File:&nbsp; {(file && file.name) || '...'}
                    </div>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleRemoveFile}
                      className="bg-white inline-flex text-sm px-3 py-1 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                  {/* <div className="hidden md:block flex-grow pl-4 text-sm text-right">
                    <Link href="/persona-sample.csv">
                      <a download className="text-blue-500 underline">
                        Template CSV
                      </a>
                    </Link>
                  </div> */}
                </div>
                </>
              )}
            </CSVReader>
          </div>
        </div>
      </div>
      <div className="aces-wrap border-t border-gray-200">
        <div className="aces-geist py-2">
          <div className="flex items-center text-sm my-3">
            {personaData.length > 0 && (
              <>
                <span className="flex-grows text-gray-500 mr-4">
                  Tampilkan/sembunyikan kolom:
                </span>
                <label className="inline-flex items-center mr-3">
                  <input
                    type="checkbox"
                    value="col-email"
                    onChange={showHideCol}
                    defaultChecked={true}
                    className="text-gray-700 w-3 h-3 rounded-sm"
                  />
                  <span className="text-xs ml-1">Email</span>
                </label>
                <label className="inline-flex items-center mr-3">
                  <input
                    type="checkbox"
                    value="col-gender"
                    onChange={showHideCol}
                    defaultChecked={true}
                    className="text-gray-700 w-3 h-3 rounded-sm"
                  />
                  <span className="text-xs ml-1">L/P</span>
                </label>
                <label className="inline-flex items-center mr-3">
                  <input
                    type="checkbox"
                    value="col-birth"
                    onChange={showHideCol}
                    defaultChecked={true}
                    className="text-gray-700 w-3 h-3 rounded-sm"
                  />
                  <span className="text-xs ml-1">Birth</span>
                </label>
                <label className="inline-flex items-center mr-3">
                  <input
                    type="checkbox"
                    value="col-phone"
                    onChange={showHideCol}
                    defaultChecked={true}
                    className="text-gray-700 w-3 h-3 rounded-sm"
                  />
                  <span className="text-xs ml-1">Phone</span>
                </label>
                <label className="inline-flex items-center mr-3">
                  <input
                    type="checkbox"
                    value="col-nip"
                    onChange={showHideCol}
                    defaultChecked={true}
                    className="text-gray-700 w-3 h-3 rounded-sm"
                  />
                  <span className="text-xs ml-1">NIP</span>
                </label>
                <label className="inline-flex items-center mr-3">
                  <input
                    type="checkbox"
                    value="col-position"
                    onChange={showHideCol}
                    defaultChecked={true}
                    className="text-gray-700 w-3 h-3 rounded-sm"
                  />
                  <span className="text-xs ml-1">Position</span>
                </label>
              </>
            )}
            {(personaData.length === 0) && (
              <span className="text-gray-500">
                Data akan ditampilkan dalam tabel di bawah ini sebelum disimpan.
              </span>
            )}
          </div>
          <div id="csv-wrap" className="max-h-80 relative overflow-x-scroll rounded-sm shadow-sm border border-gray-400 bg-gray-300 mt-3 mb-5">
            <TableCSV data={personaData} />
          </div>
          {group && personaData.length > 0 && (
            <div className="text-center">
              <div className="text-sm pb-12">
                <div className="h-2 mb-3">
                  {(hashing || submitting) && <div
                    className="h-1 rounded-full border border-gray-400"
                    style={{ backgroundImage: 'url(/mango-in-progress-01.gif)' }}
                  ></div>}
                </div>
                {!hashing && (
                  <>
                    <div className="mb-3">
                      <button
                        onClick={e => {
                          const elm = document.getElementById('csv-wrap')
                          if (elm.classList.contains('max-h-80')) {
                            elm.classList.remove('max-h-80')
                          } else {
                            elm.classList.add('max-h-80')
                          }
                        }}
                        className="text-xs bg-gray-300 bg-opacity-50 hover:bg-gray-400 active:text-gray-300 active:bg-gray-500 px-3 py-1"
                      >
                        EXPAND/COLLAPSE TABLE
                      </button>
                    </div>
                    <div className="mb-3 text-center">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          disabled={submitting}
                          onChange={e => {
                            setConfirmedToSave(e.target.checked)
                          }}
                          className="rounded border-gray-300 text-gray-600 shadow-sm focus:border-purple-300 focus:rings focus:ring-purple-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2">
                          Simpan data {personaData.length} peserta sebagai {group.groupName}
                        </span>
                      </label>
                    </div>
                    <div className="">
                      {!confirmedToSave && <button disabled
                        className="text-sm px-6 py-2 rounded border border-gray-400 text-gray-400"
                      >Save CSV Data</button>}
                      {confirmedToSave && <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="text-sm px-6 py-2 focus:outline-none rounded border border-gray-500 shadow-sm focus:border-gray-500 hover:shadow active:bg-gray-500 active:border-gray-500 active:text-white focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >Save CSV Data</button>}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TableCSV({ data }) {
  return (
    <table className="w-full text-xs whitespace-nowrap">
      <thead>
        <tr className="bg-gray-300 text-xs uppercase text-gray-600">
          <td className="h-7 px-2 py-1 text-right">##</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">fullname</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">username</td>
          <td className="col-email h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">email</td>
          <td className="col-gender h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">l/p</td>
          <td className="col-birth h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">birth</td>
          <td className="col-phone h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">phone</td>
          <td className="col-nip h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">nip</td>
          <td className="col-position h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">position</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">c-Level</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">t-Level</td>
        </tr>
        {data.length > 0 && <tr>
          <td colSpan="11" className="h-0 p-0 bg-gray-400 border-t border-gray-400"></td>
        </tr>}
      </thead>
      <tbody>
      {data.map(({
        fullname,
        username,
        email,
        gender,
        birth,
        phone,
        nip,
        position,
        currentLevel,
        targetLevel,
        xfpwd }, index) => (
          <tr key={email} className={`bg-white border-t`}>
            <td className="h-7 px-2 py-1 text-right">{index + 1}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{fullname}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{username}</td>
            <td className="col-email h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{email}</td>
            <td className="col-gender h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{gender}</td>
            <td className="col-birth h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{birth}</td>
            <td className="col-phone h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{phone}</td>
            <td className="col-nip h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{nip}</td>
            <td className="col-position h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{position}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{currentLevel}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-500 border-opacity-25">{targetLevel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


/* <div className="my-3">
  <button
    className="border px-3 py-1"
    onClick={e => {
      let startTime = Date.now();
      if (!cTime) setCTime((startTime / 1000).toFixed(3))
      if (CID) {
        clearInterval(CID)
        setCID(null)
      } else {
        setCID(setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          // const elapsedTime = Date.now() - cTime;
          setCounter((elapsedTime / 1000).toFixed(3))
        }, 100))
      }
    }}
  >{ counter === 0 ? 'START' : counter }</button>
</div> */