import { SVGKey } from "@components/SVGIcon"
import fetchJson from "@lib/fetchJson"
import { useClients } from "@lib/hooks/client"
import { useState } from "react"

function createProjectModel() {
  return {
    title: '',
    license: '',
    shortTitle: '',
    description: '',
    startDate: '',
    endDate: '',

    clientId: '',
    clientName: '',
    clientAddress: '',
    clientCity: '',
    clientPhone: '',
  }
}

export default function NewProjectForm({ callback }) {
  const { clients, isLoading, isError } = useClients()

  const [model, setModel] = useState( createProjectModel() )
  const [clientType, setClientType] = useState('new')
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function findClientName(clientId) {
    for (let i=0; i< clients.length; i++) {
      if (clients[i]._id == clientId) return clients[i].name
    }

    return ''
  }

  function changeClientType (e) {
    setClientType(e.target.value)
    if (e.target.value == 'new') {
      setModel(prev => ({
        ...prev,
        clientId: null,
        clientName: null,
      }))
    } else {
      setModel(prev => ({
        ...prev,
        clientId: null,
        clientName: null,
        clientAddress: null,
        clientCity: null,
        clientPhone: null,
      }))
    }
  }

  function setValue(e) {
    const field = e.target.name
    const value = e.target.value
    setModel(prev => ({
      ...prev,
      [field]: value
    }))
    setConfirmed(false)
  }

  function setClient(e) {
    setValue(e)

    setModel(prev => ({
      ...prev,
      clientName: findClientName(e.target.value)
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
    return model?.title && model?.shortTitle && (
      model?.clientId  || (model?.clientName && model?.clientCity)
    )
  }

  async function submitProject(e) {
    setSubmitting(true)

    const body = model
    console.log(body);
    // return


    const url = '/api/post?q=create-project'
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

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row mb-3">
        <div className="flex-0 w-40 text-gray-600">
          <label className="flex text-xs font-medium uppercase pt-2">
            <span>Project title:</span>
            <SVGKey className="w-4 h-4 ml-1 text-purple-400"/>
          </label>
        </div>
        <div className="flex-grow">
          <input onChange={setTitle}
            name="title"
            type="text"
            className="px-2 py-2 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row mb-3">
        <div className="flex-0 w-40 text-gray-600">
          <label className="flex text-xs font-medium uppercase pt-2">
            <span>Dummy title:</span>
            <SVGKey className="w-4 h-4 ml-1 text-purple-400"/>
          </label>
        </div>
        <div className="flex-grow">
          <input value={model.shortTitle} onChange={setValue}
            name="shortTitle"
            maxLength="36"
            disabled={model.title.length <= 36}
            type="text"
            className="px-2 py-2 bg-gray-100 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row mb-3">
        <div className="flex-0 w-40 text-gray-600">
          <label className="text-xs font-medium uppercase">
            Description:
          </label>
        </div>
        <div className="flex-grow">
          <textarea
            rows="3"
            name="description"
            onChange={setValue}
            className="px-2 py-2 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row mb-3">
        <div className="flex-0 w-40 text-gray-600">
          <label className="text-xs font-medium uppercase pt-2">
            Start date:
          </label>
        </div>
        <div className="flex-grow">
          <input onChange={setValue}
            name="startDate"
            type="date"
            className="px-2 py-2 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row mb-3">
        <div className="flex-0 w-40 text-gray-600">
          <label className="text-xs font-medium uppercase pt-2">
            End date:
          </label>
        </div>
        <div className="flex-grow">
          <input onChange={setValue}
            name="endDate"
            type="date"
            className="px-2 py-2 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="rounded border border-indigo-200 px-4 sm:px-5 py-4 my-6">
        <div className="flex flex-row justify-center items-center text-gray-600 mb-6">
          <label className="text-xs font-medium uppercase">
            Project for:
          </label>
          <label className="inline-flex items-center text-sm ml-4">
            <input value="new" defaultChecked={true}
              type="radio" name="type"
              className="form-radio border border-gray-400"
              onChange={changeClientType}
            />
            <span className="ml-2">
              New client
            </span>
          </label>
          <label className="inline-flex items-center text-sm ml-4">
            <input value="old" disabled={clients?.length === 0}
              type="radio" name="type"
              className="form-radio border border-gray-400"
              onChange={changeClientType}
            />
            <span className={clients?.length === 0 ? 'text-gray-400 ml-2' : 'ml-2'}>
              Existing client
            </span>
          </label>
        </div>

        {clientType == 'old' && (
          <div className="flex flex-col sm:flex-row mb-3">
            <div className="flex-0 w-40 text-gray-600">
              <label className="flex text-xs font-medium uppercase pt-2">
                <span>
                  Select client:
                </span>
                <SVGKey className="w-4 h-4 ml-1 text-purple-400"/>
              </label>
            </div>
            <div className="flex-grow">
              <select
                name="clientId"
                onChange={setClient}
                className="block w-full text-sm px-2 py-2 rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option></option>
                {clients?.map(({ _id, name, city }) => (
                  <option key={_id} value={_id}>{`${name}, ${city}`}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {clientType == 'new' && (
          <div>
            <div className="flex flex-col sm:flex-row mb-3">
              <div className="flex-0 w-36 text-gray-600">
                <label className="flex text-xs font-medium uppercase pt-2">
                  <span>
                    Company name:
                  </span>
                  <SVGKey className="w-4 h-4 ml-1 text-purple-400"/>
                </label>
              </div>
              <div className="flex-grow">
                <input onChange={setValue}
                  name="clientName"
                  type="text"
                  className="px-2 py-2 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row mb-3">
              <div className="flex-0 w-36 text-gray-600">
                <label className="text-xs font-medium uppercase">
                  Company address:
                </label>
              </div>
              <div className="flex-grow">
                <input onChange={setValue}
                  name="clientAddress"
                  type="text"
                  className="px-2 py-2 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row mb-3">
              <div className="flex-0 w-36 text-gray-600">
                <label className="flex text-xs font-medium uppercase pt-2">
                  <span>
                    City:
                  </span>
                  <SVGKey className="w-4 h-4 ml-1 text-purple-400"/>
                </label>
              </div>
              <div className="flex-grow">
                <input onChange={setValue}
                  name="clientCity"
                  type="text"
                  className="px-2 py-2 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row mb-1">
              <div className="flex-0 w-36 text-gray-600">
                <label className="text-xs font-medium uppercase">
                  Phones:
                </label>
              </div>
              <div className="flex-grow">
                <input onChange={setValue}
                  name="clientPhone"
                  type="text"
                  className="px-2 py-2 block w-full text-sm rounded-sm border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-2 mt-6 mb-4">
        {submitting && <div
          className="h-2 rounded-full border border-gray-300"
          style={{
            backgroundImage: "url(/mango-in-progress-01.gif)",
            height: "4px"
          }}
        ></div>}
      </div>

      <div className="flex flex-col sm:flex-row mb-3">
        <div className="flex-0 w-40 text-gray-600">
          &nbsp;
        </div>
        <div className="flex-grow text-center sm:text-left">
          <label className="inline-flex items-center text-sm">
            <input
              disabled={!isReady()}
              type="checkbox"
              onChange={e => { setConfirmed(e.target.checked) }}
              className="rounded border-gray-300 text-purple-500 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
            />
            <span className={'ml-2 ' + (isReady() ? 'text-gray-700' : 'text-gray-400')}>
              {/* {lang.LABEL_CONFIRM_TO_SAVE_PROJECT} */}
              Please confirm
            </span>
          </label>
          <div className="my-3">
            {(!isReady() || !confirmed) && <button disabled className="inline-flex items-center text-gray-400 text-sm font-semibold px-6 py-2 rounded border border-gray-300">
              Save Project
            </button>}
            {(isReady() && confirmed) && <button
              onClick={submitProject}
              className="inline-flex items-center text-sm font-semibold px-6 py-2 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-purple-400 focus:tex-purple-600 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
            >
              Save Project
            </button>}
          </div>
        </div>
      </div>
    </div>
  )
}