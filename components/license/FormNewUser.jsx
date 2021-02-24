import { SVGProfile } from "@components/SVGIcon"
import fetchJson from "@lib/fetchJson"
import useUser from "@lib/hooks/useUser"
import { UserModel } from "@lib/models"
import Link from "next/link"
import { useState } from "react"

function newModel(user) {
  let model = UserModel
  model.license = user.license
  model.createdBy = user.username

  return model
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function FormNewUser() {
  const { user } = useUser()

  const [viewState, setViewState] = useState(0)
  const [model, setModel] = useState(newModel(user))
  const [response, setResponse] = useState(null)

  const [nameMsg, setNameMsg] = useState(null)
  const [usernameMsg, setUsernameMsg] = useState(null)
  const [emailMsg, setEmailMsg] = useState(null)
  const [usernameTaken, setUsernameTaken] = useState(false)

  function isReady() {
    return model.fullname && model.fullname.length > 4 && model.username.length > 5 && validateEmail(model.email)
  }

  function handleRoles(e) {
    console.log(e.target.checked)
    const val = e.target.value
    if (e.target.checked) {
      setModel(prev => ({
        ...prev, roles: [...prev.roles, val]
      }))
    } else {
      setModel(prev => ({
        ...prev,
        roles: [...prev.roles.filter(el => el !== val)]
      }))
    }
  }

  function reset() {
    setNameMsg(null)
    setUsernameMsg(null)
    setEmailMsg(null)
    setModel(newModel(user))
  }

  function more() {
    reset()
    setViewState(0)
  }

  async function checkUsername(username) {
    const url = `/api/get?q=check-username&find=${username}`
    const response = await fetchJson(url)
    if (response._id) {
      setUsernameTaken('Sudah terpakai')
      setUsernameMsg('Sudah terpakai')
    }
    else {
      setUsernameTaken(null)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // console.log(model); return;

    setResponse(null)
    setViewState(1)
    const url = '/api/post?q=create-user'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(model),
    })

    if (response.username && response.password) {
      setResponse(response)
      setViewState(2)
    }

    reset()
  }

  if (viewState === 1) return <Submitting />

  if (viewState === 2) return <Success response={response} reset={more} />

  const inputBase = "text-sm mt-1s px-2 py-1 rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  const inputError = "text-sm mt-1s px-2 py-1 rounded-sm border-red-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"

  return (
    <div className="max-w-xl">
      <div className="rounded-md border border-indigo-400 p-4">
        <div className="border-b border-indigo-400 -mx-4 px-4 pb-3">
          <div className="flex flex-row items-center text-indigo-600">
            <SVGProfile className="w-6 h-6" />
            <div className="text-lg ml-2 font-semibold ">
              Add New User
            </div>
          </div>
        </div>
        <div className="text-xs text-centers text-gray-500 mt-2 mb-6">
          Nama, username, dan email harus diisi. Username minimal enam karakter.
        </div>
          <table className="w-full text-sm">
            <tbody>
              <tr><td width="25%"></td><td></td></tr>
              <tr>
                <td className="text-right text-gray-500 whitespace-nowrap py-1 align-top pt-2">
                  Nama lengkap:
                </td>
                <td className="px-3 py-1 text-sm">
                  <input type="text" autoFocus value={model.fullname}
                    onChange={e => {
                      const val = e.target.value
                      // console.log( val )
                      setModel(prev => ({
                        ...prev, fullname: val
                      }))
                    }}
                    onBlur={e => {
                      const v = e.target.value.trim()
                      setModel(prev => ({
                        ...prev, fullname: v
                      }))
                      setNameMsg(v.length < 5 ? 'Minimal 5 karakter' : null)
                    }}
                    className={'w-full ' + (nameMsg ? inputError : inputBase)}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-right text-gray-500 py-1 align-top pt-2">
                  Username:
                </td>
                <td className="px-3 py-1">
                  <input type="text" value={model.username}
                    onChange={e => {
                      const val = e.target.value
                      setModel(prev => ({
                        ...prev, username: val
                      }))
                    }}
                    onBlur={e => {
                      const val = e.target.value
                      const v = val.trim().toLocaleLowerCase()
                      setModel(prev => ({
                        ...prev, username: v
                      }))
                      if (v.length < 6) setUsernameMsg('Minimal 6 karakter')
                      else setUsernameMsg(null)

                      checkUsername(v)
                    }}
                    className={'w-56 ' + (usernameMsg ? inputError : inputBase)}
                  />
                  {usernameTaken && <span className="text-xs text-red-500 ml-2">{usernameTaken}</span>}
                </td>
              </tr>
              <tr>
                <td className="text-right text-gray-500 align-top pt-2">
                  Email:
                </td>
                <td className="px-3 py-1">
                  <input type="text" value={model.email}
                    onChange={e => {
                      const val = e.target.value.trim()
                      setModel(prev => ({
                        ...prev, email: val.toLowerCase()
                      }))
                    }}
                    onBlur={e => {
                      const val = e.target.value.trim()
                      setEmailMsg( validateEmail(val) ? null : 'Error')
                    }}
                    className={'w-56 ' + (emailMsg ? inputError : inputBase)}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-right text-gray-500 py-1">
                  Telepon/HP:
                </td>
                <td className="px-3 py-1">
                  <input type="text"
                    onChange={e => {
                      const val = e.target.value.trim()
                      setModel(prev => ({
                        ...prev, phone: val
                      }))
                    }}
                    className={'w-56 ' + inputBase}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-right text-gray-500 py-2">
                  Admin roles:
                </td>
                <td className="px-3 py-2">
                  <label className="mr-5">
                    <input
                      type="checkbox"
                      value="project-creator"
                      className="form-checkbox text-indigo-500 rounded-sm border border-gray-300 focus:ring focus:ring-indigo-100"
                      onChange={handleRoles}
                    />
                    <span className="ml-2">This user may create project</span>
                  </label>
                </td>
              </tr>
              <tr>
                <td className="text-right text-gray-500 py-1"></td>
                <td className="px-3 py-5 text-gray-600">
                  <Link href={`/license/users`}>
                    <a
                      className="inline-flex text-sm px-3 py-1 mr-2 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      Cancel
                    </a>
                  </Link>
                  {!isReady() && <button disabled
                  className="text-sm focus:outline-none rounded border border-gray-300 text-gray-400 px-3 py-1"
                  >Save New User</button>}
                  {isReady() && <button onClick={handleSubmit}
                  className="text-sm mr-2 px-3 py-1 focus:outline-none hover:shadow rounded border border-indigo-400 hover:border-indigo-500 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 active:bg-purple-400 active:text-white"
                  >Save New User</button>}
                </td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>
  )
}

function Submitting() {
  return (
    <div className="text-lg text=gray=400 p-4">
      Wait...
    </div>
  )
}

function Success({ response, reset }) {
  return (
    <div className="max-w-xl rounded-md border border-green-400 p-4">
      <div className="-mx-4 px-4 pb-3">
        <div className="flex flex-row items-center justify-center text-green-600">
          <SVGProfile className="w-6 h-6 mr-2" />
          <div className="text-lg font-semibold ">
            New user created
          </div>
        </div>
      </div>
      <div className="bg-green-100 text-center -mx-4 p-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td width="50%" className="text-right p-1">Nama lengkap:</td>
              <td width="50%" className="text-left p-1 font-bold">{response?.fullname ? response?.fullname : 'error'}</td>
            </tr>
            <tr>
              <td width="50%" className="text-right p-1">Username:</td>
              <td width="50%" className="text-left p-1 font-bold">{response?.username ? response?.username : 'error'}</td>
            </tr>
            <tr>
              <td width="50%" className="text-right p-1">Password:</td>
              <td width="50%" className="text-left p-1 font-bold">{response?.password ? response?.password : 'error'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center text-sm -mx-4 px-16 py-2">
        <p className="mb-5">Silakan catat informasi ini. User dapat mengubah password setelah berhasil login.</p>
        <div className="text-center">
          {/* <button
          className="text-sm focus:outline-none rounded border border-gray-400 hover:border-gray-500 focus:border-blue-500 hover:shadow active:border-purple-500 active:bg-purple-500 active:text-white px-3 py-1"
          onClick={e => {
            reset()
            setViewState(0)
          }}purple
          >Done</button> */}
          <Link href={`/license/users`}>
            <a
              className="inline-flex text-sm px-3 py-1 mr-2 focus:outline-none hover:shadow rounded border border-gray-400 hover:border-gray-500 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              Done
            </a>
          </Link>
          <button
          className="text-sm focus:outline-none rounded border border-gray-400 hover:border-gray-500 focus:border-blue-500 hover:shadow active:border-purple-500 active:bg-purple-500 active:text-white px-3 py-1"
          onClick={reset}
          >Create More</button>
        </div>
      </div>
    </div>
  )
}