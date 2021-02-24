import PageLoading from "@components/PageLoading";
import { SVGPlus } from "@components/SVGIcon";
import { SVGGuest, SVGGear } from "@components/SVGIcon"
import fetchJson from "@lib/fetchJson";
import { GuestModel } from '@lib/models'
import { useGuests } from "@lib/hooks/guest";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProjectSimpleInfo } from "@lib/hooks";

function newGuestModel(pid) {
  let model = GuestModel
  model.projectId = pid

  return model
}

export default function Guests({ user }) {
  const router = useRouter()
  const { pid } = router.query
  const { projectSimpleInfo, isLoading: infoLoading, isError: infoError } = useProjectSimpleInfo(pid)
  const { guests, isLoading, isError, mutate } = useGuests(pid)

  const [guestsArray, setGuestsArray] = useState([])
  const [hasExperts, setHasExperts] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (guests) {
      setGuestsArray(guests)
      setHasExperts(guests.some(g => g.type == 'expert'))
    }
  },[guests])


  if (isError || infoError) return (
    <pre>
      {JSON.stringify(isError, null, 2)}
    </pre>
  )

  if (isLoading || infoLoading) return <PageLoading />

  const isAdmin = user?.username === projectSimpleInfo?.admin

  function notifyDelete(e) {
    console.log(e)
    setGuestsArray(guestsArray.filter(g => g._id != e.target.value))
  }

  return (
    <div className="-mt-2">
      <div className="flex items-center border-bs border-gray-200 pb-2 mb-2">
        <div className="flex-grow text-2xl text-green-600">
          Project Guests
        </div>
        {isAdmin && <button
          onClick={e => setShowForm(true)}
          className="inline-flex items-center bg-gray-50 text-sm text-gray-600 font-medium leading-loose pl-2 pr-4 py-1 focus:outline-none hover:bg-gray-200 focus:bg-gray-300 active:bg-gray-100"
        >
          <SVGPlus className="w-4 h-4 mr-1"/>
          Add Guest
        </button>}
      </div>
      <div className="max-w-xl mx-auto sm:mx-0">
        {showForm &&
          <GuestForm
            pid={pid}
            onSuccess={() => {
              mutate()
              setShowForm(false)
            }}
            onCancel={() => {
              setShowForm(false)
            }}
          />
        }

        {!showForm && (
          <div className="mt-4">
            {!isAdmin && guests.length === 0 && (
              <p className="text-sm text-gray-600">
                Hanya administartor proyek yang dapat menambahkan/mengundang
                project guest.
              </p>
            )}
            {isAdmin && guests.length === 0 && (
              <p className="text-sm text-gray-600">
                Gunakan tombol <span className="text-gray-700 font-medium">Add Guest</span>{` `}
                di sebelah kanan atas untuk menambahkan project guest.
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              {guestsArray.filter(g => g.type == 'client').map((g) =>
                <GuestCard key={g._id}
                  isAdmin={isAdmin}
                  guest={g}
                  notifyDelete={ notifyDelete }
                  mutate={mutate}
                />
              )}
            </div>
            {hasExperts && (
              <div className="mt-10">
                <div className="mb-6">
                  <div className="text-xl text-gray-700">
                    Expert guests
                  </div>
                  <hr />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {guestsArray.filter(g => g.type == 'expert').map((g) =>
                    <GuestCard key={g._id}
                      isAdmin={isAdmin}
                      guest={g}
                      notifyDelete={ notifyDelete }
                      mutate={mutate}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function GuestForm({ pid, onSuccess, onCancel }) {
  const [model, setModel] = useState(newGuestModel(pid))
  const [submitting, setSubmitting] = useState(false)

  function isReady() {
    if (!model) {
      return false
    } else {
      return model?.fullname.length > 3 && model.email
    }
  }

  async function handleSubmit(e) {
    setSubmitting(true)
    let body = model
    body.email = model.email.trim().toLowerCase()

    const url = '/api/post?q=create-guest'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response.created) {
      onSuccess()
    }
    setModel(newGuestModel(pid))
  }

  return (
    <div className="max-w-sm rounded shadow-sm bg-gray-300 p-px mt-3">
      <div className="px-4 py-2 bg-gray-100s">
        <span className="text-gray-600 font-bold">New Project Guest</span>
      </div>
      <div className="bg-white rounded-b p-2">
        <table className="text-sm">
          <tbody>
            <tr>
              <td className="w-28 p-2 pl-0 text-gray-600 text-right whitespace-nowrap">Guest type:</td>
              <td className="p2 py-3">
                <select
                  onChange={e => {
                    setModel(m => ({ ...m, type: e.target.value}))
                  }}
                  className="text-sm py-1 rounded border-gray-300 hover:border-gray-400 shadow-sm hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="">- Select -</option>
                  <option value="client">Client</option>
                  <option value="expert">Expert</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="p-2 pl-0 text-gray-600 text-right whitespace-nowrap">Full name:</td>
              <td className="p2">
                <input
                  type="text"
                  onChange={e => setModel(m => ({ ...m, fullname: e.target.value}))}
                  disabled={!model || model.type == ''}
                  className="text-sm px-2 py-1 rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 pl-0 text-gray-600 text-right whitespace-nowrap">Email:</td>
              <td className="p2">
                <input
                  type="text"
                  onChange={e => setModel(m => ({ ...m, email: e.target.value}))}
                  disabled={!model || model.type == ''}
                  className="text-sm px-2 py-1 rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </td>
            </tr>
            <tr>
              <td className="p-2 pl-0 text-gray-600 text-right whitespace-nowrap">Phone:</td>
              <td className="p2">
                <input
                  type="text"
                  onChange={e => setModel(m => ({ ...m, phone: e.target.value}))}
                  disabled={!model || model.type == ''}
                  className="text-sm px-2 py-1 rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td className="p2 py-3">
                <div className="pb-3">
                  <div className={(submitting ? 'submitting ' : '') + `h-2 rounded-full border border-gray-200`}></div>
                </div>
                <button
                  disabled={!isReady()}
                  onClick={handleSubmit}
                  className="text-sm w-28 py-1 rounded border border-gray-300 active:bg-gray-50 hover:border-gray-400 shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={e => {
                    newGuestModel(pid)
                    onCancel()
                  }}
                  className="text-sm ml-2 px-4 py-1 rounded border border-gray-300 active:bg-gray-50 hover:border-gray-400 shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <style jsx>{`
      input[type="text"]:disabled {
        background-color: rgb(250, 250, 250);
      }
      button:disabled {
        color: gray;
      }
      .submitting {
        background-image: url(/mango-in-progress-01.gif);
      }
      `}</style>
    </div>
  )
}


function GuestCard({ isAdmin, guest, notifyDelete, mutate }) {
  const eid = 'G' + guest._id
  const progress = 'P' + guest._id

  const [submitting, setSubmitting] = useState(false)

  async function handleDelete(e) {
    setSubmitting(true)

    const url = '/api/post?q=delete-guest'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: guest._id }),
    })

    if (response) {
      notifyDelete(e)
    }
  }

  async function handleDisable(state = 'disable') {
    setSubmitting(true)
    console.log('state:', state)

    let url = '/api/post?q=disable-guest'
    if (state == 'enable') {
      url += '&enable=1'
    }

    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ id: guest._id }),
    })

    if (response) {
      mutate()
    }

    setSubmitting(false)
    const elm = document.getElementById(eid)
    elm.classList.remove('editing')
  }

  async function handleChangePassword(e) {

  }

  // className="rounded border border-gray-300 shadow-sm">
  return (
    <div className="rounded bg-gray-50 border border-gray-400 border-opacity-50 shadow-sm">
      <div className="flex items-start px-3 py-2">
        <SVGGuest className={`w-5 h-5 mr-2 text-` + (guest.disabled ? 'gray-300' : (guest.type == 'client' ? 'blue-400' : 'pink-700'))}/>
        <div className="flex-grow text-gray-600 text-sm font-semibold">
          {guest.fullname}
        </div>
        <button
          onClick={e => {
            if (!isAdmin) return false
            if (!submitting) {
              const elm = document.getElementById(eid)
              if (elm.classList.contains('editing')) {
                elm.classList.remove('editing')
              } else {
                elm.classList.add('editing')
              }
            }
          }}
          className="-mr-1 text-gray-300 hover:text-gray-500"
        ><SVGGear className="w-4 h-4"/></button>
      </div>

      <div className="relative h-28 rounded-b overflow-hidden">

        <div className="absolute w-full h-28 border-t text-sm pl-10 pr-3 pt-2 bg-white">
          <div className="text-xss text-gray-500 leading-none uppercase">Email</div>
          <div className="text-blue-400 leading-snug mb-2">{guest.email}</div>
          <div className="text-xss text-gray-500 leading-none uppercase">Phone</div>
          <div className="text-blue-400 leading-snug mb-2">{guest.phone}</div>
          <div className="text-xs text-gray-400">
            {guest.disabled && <span className="inline-block text-xss leading-none rounded-full bg-gray-200 px-2 py-1">DISABLED</span>}
            {!guest.disabled && <span className="inline-block text-xss text-white uppercase leading-none rounded-full bg-gray-400 px-2 py-1">Active</span>}
          </div>
        </div>

        <div id={eid} className="absolute -top-32 w-full h-28 flex items-center justify-center border-t border-gray-300 text-sm bg-gray-200">
          <div className="grid grid-cols-2 gap-2 w-36">
            {!guest.disabled && <button
              value={guest._id}
              onClick={handleDisable}
              className="rounded text-xs leading-4 bg-gray-50 hover:bg-white border border-gray-400 hover:border-gray-400 shadow-sm px-2 py-1"
            >Disable
            </button>}
            {guest.disabled && <button
              value={guest._id}
              onClick={e => handleDisable('enable')}
              className="rounded text-xs leading-4 bg-gray-50 hover:bg-white border border-gray-400 hover:border-gray-400 shadow-sm px-2 py-1"
            >Activate
            </button>}
            <button
              value={guest._id}
              onClick={handleDelete}
              className="rounded text-xs leading-4 bg-gray-50 hover:bg-white border border-gray-400 hover:border-gray-400 shadow-sm px-2 py-1"
            >Delete
            </button>
            <button
              value={guest._id}
              onClick={handleChangePassword}
              className="rounded text-xs leading-4 bg-gray-50 hover:bg-white border border-gray-400 hover:border-gray-400 shadow-sm px-2 py-1 col-span-2"
            >Change Password
            </button>
            <div className="pt-1 col-span-2">
              <div id={progress} className={(submitting ? 'submitting ' : '') + `h-2 rounded-full border border-gray-400`}></div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
      #${eid} {
        transition: all .25s ease;
      }
      #${eid}.editing {
        top: 0;
        transition: all .25s ease;
      }
      #${progress}.submitting {
        background-image: url(/mango-in-progress-01.gif);
      }
      `}</style>
    </div>
  )
}