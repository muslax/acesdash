import { ButtonExpanderDown } from "@components/buttons/ButtonExpander";
import { ButtonExpanderRight } from "@components/buttons/ButtonExpander";
import { SVGLock } from "@components/SVGIcon";
import { EVGEllipsis } from "@components/SVGIcon";
import fetchJson from "@lib/fetchJson";
import { useUsers } from "@lib/hooks";
import useUser from "@lib/hooks/useUser";
import Link from "next/link";
import { useState } from "react";

export default function LicenseUsers() {
  const { user: currentUser } = useUser()
  const { users, isLoading, isError, mutate: mutateUsers } = useUsers()

  const [viewState, setViewState] = useState(0)
  const [showStack, setShowStack] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [deleteForm, setDeleteForm] = useState(null)

  function collpaseAllRows() {
    setShowStack([])
    window.scrollTo(0, 0)
  }

  return (
    <div className="-mt-2">
      <div className="">
        <div className="mb-6">
          <h3 className="text-2xl font-medium mb-2">License Users</h3>
          <p className="text-sm text-gray-500">
            Penambahan user hanya dapat dilakukan oleh{` `}
            <span className="text-gray-800 font-medium">License Owner</span>
          </p>
        </div>

        <table className="w-full leading-snug text-sm text-gray-700">
          <thead>
            <tr className="border-b font-medium border-purple-300">
              <td width="30" className="bg-purple-200 rounded-tl p-2">#</td>
              <td className="bg-purple-200 p-2">Nama Lengkap</td>
              <td className="bg-purple-200 p-2 pr-3 text-right">Roles</td>
              <td width="30" className="bg-purple-200 rounded-tr p-2 text-gray-400">&nbsp;</td>
            </tr>
          </thead>
          {isLoading && (
            <tbody>
              <tr>
                <td colSpan="4" className="py-6 text-center">Loading...</td>
              </tr>
            </tbody>
          )}
          {isError && (
            <tbody>
              <tr>
                <td colSpan="4" className="py-6 text-center text-red-500">Error loading data.</td>
              </tr>
            </tbody>
          )}
          {users?.map((user, index) => (
            <tbody key={user._id}>
              <tr className={`border-b border-gray-200 ` + (deleteId == user._id ? 'text-gray-200' : '')}>
                <td className="p-2">{index + 1}</td>
                <td className={currentUser.id == user._id ? 'p-2 font-semibold' : 'p-2'}>
                  <div className="flex items-center">
                    <span className="inline-block">{user.fullname}{` `} {currentUser.id == user._id ? '(me)' : ''}</span>
                    {user.licenseOwner && (
                      <div className="w-5 h-5 text-red-500 ml-1">
                        <SVGLock />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-2 pt-1 text-right">{!showStack.includes(user._id) ? userRoles(user.roles, 'right') : ''}</td>
                <td className="text-center align-middle px-2 pt-2">
                  {!showStack.includes(user._id) && <ButtonExpanderRight clickHandler={e => {
                    if (viewState > 0) return;
                    setShowStack(prev => ([
                      ...prev,
                      user._id
                    ]))
                  }}/>}
                  {showStack.includes(user._id) && <ButtonExpanderDown clickHandler={e => {
                    if (viewState > 0) return;
                    setShowStack(showStack.filter((item) => {
                      return item !== user._id
                    }))
                  }}/>}
                </td>
              </tr>
              {showStack.includes(user._id) && (
                <tr className="border-b border-gray-200 bg-yellow-100 bg-opacity-25">
                  <td></td>
                  <td colSpan="3" className="px-2 py-4">
                    {/*  */}
                    <div className="float-right text-right text-xs pl-6 pr-2">
                      {(user._id !== currentUser.id) && user.roles?.includes('license-admin') && (
                        <button disabled className="rounded -mt-1 text-gray-500">
                          <span className="flex inline-flex w-6 h-6">
                            <SVGLock />
                          </span>
                        </button>
                      )}
                      {currentUser._id == user._id && (
                      <Link href="/cpwd">
                        <a className="text-blue-500 hover:text-blue-400 hover:underline">
                          Change password
                        </a>
                      </Link>
                      )}
                      {/* {currentUser._id != user._id && !user.roles.includes('license-admin') && ( */}
                      {currentUser.licenseOwner  && currentUser._id !== user._id && (
                        <>
                          <UserModifier
                            user={user}
                            deleteForm={deleteForm}
                            setDeleteForm={setDeleteForm}
                            setDeleteId={setDeleteId}
                            mutate={mutateUsers}
                          />
                        </>
                      )}
                    </div>
                    <table className="text-xs">
                      <tbody>
                        <tr>
                          <td width="120" className="px-0 py-1">Nama Lengkap:</td>
                          <td className="p-1">{user.fullname}</td>
                        </tr>
                        <tr>
                          <td className="px-0 py-1">Roles:</td>
                          <td className="p-1">{userRoles(user.roles)}</td>
                        </tr>
                        <tr>
                          <td className="px-0 py-1">Username:</td>
                          <td className="p-1">{user.username}</td>
                        </tr>
                        <tr>
                          <td className="px-0 py-1">Email:</td>
                          <td className="p-1">{user.email}</td>
                        </tr>
                        <tr>
                          <td className="px-0 py-1">Telepon:</td>
                          <td className="p-1">{user.phone ? user.phone : '-'}</td>
                        </tr>
                        <tr>
                          <td className="px-0 py-1">Date Created:</td>
                          <td className="p-1">{ user.createdAt.substr(0, 10) }</td>
                        </tr>
                      </tbody>
                    </table>
                    {/*  */}
                  </td>
                </tr>
              )}
            </tbody>
          ))}
        </table>
      </div>
      {currentUser.licenseOwner && (
        <div className="mt-8">
          <Link href={`/license/new-user`}>
            <a
              className="inline-flex text-sm px-5 py-2 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              Create New User
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

function userRoles(roles, margin = 'left') {
  if (!roles || roles.length === 0) return <div>-</div>
  let klas = 'tag-pill rounded-lg bg-yellow-200 text-red-400'
  if (margin == 'left') klas += ' mr-2'
  else klas += ' ml-2'

  return (
    <>
      {margin == 'right' && (
        <span className={klas}>{ roles[0] }</span>
      )}
      {margin == 'left' && roles.map(role => (
        <span key={role} className={klas}>{ roles[role] ? roles[role] : role }</span>
      ))}
      <style jsx>{`
      .tag-pill {
        font-size: 0.5625rem;
        line-height: 1;
        display: inline-block;
        text-transform: uppercase;
        padding: 4px 8px;
      }
      `}</style>
    </>
  )
}

function UserModifier({ user, deleteForm, setDeleteForm, setDeleteId, mutate }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleDelete(e) {
    e.preventDefault()
    setDeleteForm(null)
    setDeleteId(e.target.value)

    const url = '/api/post?q=delete-user'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: e.target.value }),
    })
    console.log('DELETE RESPONSE', response)

    mutate()
  }

  return (
    <div>
      {deleteForm !== user._id && (
        <button value={user._id}
          onClick={e => setDeleteForm(user._id)}
          className="rounded-sm border border-transparent px-1 py-px hover:bg-gray-200 hover:border-gray-200 focus:outline-none active:border-red-500 active:bg-red-500 text-red-500 active:text-gray-100"
        >Delete</button>
      )}
      {deleteForm == user._id && (
        <div className="">
          <label className="flex justify-end cursor-pointer mb-1">
            <input type="checkbox"
              onChange={e => setConfirmDelete(e.target.checked)}
            />
            <span className="ml-2 hover:text-gray-500">Confirm to delete</span>
          </label>
          <p className="mb-3">
            {confirmDelete ? 'There will be no recovery' : '...'}
          </p>
          <button value={user._id}
            onClick={e => {
              setConfirmDelete(false)
              setDeleteForm(null)
            }}
            className="rounded-sm border border-red-400 mr-1 px-1 py-px hover:shadow hover:border-red-500 focus:outline-none active:border-red-500 active:bg-red-500 text-red-500 active:text-gray-100"
          >Cancel</button>
          {!confirmDelete && <button disabled
            className="rounded-sm border border-gray-300 px-1 py-px text-gray-400"
          >Delete</button>}
          {confirmDelete && <button value={user._id}
            onClick={handleDelete}
            className="rounded-sm border border-red-400 px-1 py-px hover:shadow hover:border-red-500 focus:outline-none active:border-red-500 active:bg-red-500 text-red-500 active:text-gray-100"
          >Delete</button>}
        </div>
      )}
    </div>
  )
}