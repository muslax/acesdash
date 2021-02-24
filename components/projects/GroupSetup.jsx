import { ButtonExpanderDown } from "@components/buttons/ButtonExpander"
import { ButtonExpanderRight } from "@components/buttons/ButtonExpander"
import { SVGMidi } from "@components/SVGIcon"
import { SVGFamily } from "@components/SVGIcon"
import fetchJson from "@lib/fetchJson"
import { useModulesMeta } from "@lib/hooks"
import { useEffect, useState } from "react"
import { mutate } from "swr"

export default function GroupSetup({ group, ...props }) {
  const isEditing = props.isEditing || false // !== undefined
  const callback = props.callback || undefined

  const { meta, isError: metaError, isLoading: metaLoading } = useModulesMeta()

  const [domains, setDomains] = useState([])
  const [selection, setSelection] = useState([])
  const [vStack, setVStack] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (meta) {
      const array = []
      meta.forEach(({ domain }) => {
        if (!array.includes(domain)) {
          array.push(domain)
        }
      })

      setDomains(array)
    }

    if (group.modules.length > 0) {
      const selection_ = []
      group.modules.forEach(module => {
        selection_.push(module.metaId)
      })

      setSelection(selection_)
    }
    return () => {}
  }, [meta, group])

  function prepareBody() {
    let body = {
      _id: group._id ?? null, // null when it is ne group
      projectId: group.projectId,
      groupName: group.groupName,
      modules: [],
      createdBy: null,
      createdAt: null,
      updatedAt: null,
    }

    meta.forEach(m => {
      if (selection.includes(m._id)) {
        body.modules.push({
          metaId: m._id,
          domain: m.domain,
          method: m.method,
          order: m.order,
          moduleName: m.moduleName,
          description: m.description,
          remark: m.remark,
        })
      }
    })

    return body
  }

  async function submitSelection() {
    setSubmitting(true)

    let body = prepareBody()

    // update-group-and-personae
    // const url = body._id ? '/api/post?q=update-project-group' : '/api/post?q=create-project-group'
    const url = body._id ? '/api/post?q=update-group-and-personae' : '/api/post?q=create-project-group'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })

    console.log('response', response)

    if (response) {
      console.log('mutating project groups...')
      window.scrollTo(0, 0)
      mutate(`/api/get?q=get-groups&pid=${group.projectId}`)
      if (callback !== undefined) {
        callback()
      }
    }
  }

  // const headerClass = `bg-gray-100 bg-opacity-75 border-b border-t border-gray-300 border-opacity-25`
  const rowClass = `border-b border-gray-400 border-opacity-25`
  const newSelectedClass = `bg-gray-100 bg-opacity-50 ${rowClass}`
  const editingSelectedClass = `bg-yellow-50 bg-opacity-75 ${rowClass}`
  const rowSelectedClass = isEditing ? editingSelectedClass : newSelectedClass

  return (
    <div className="">
      {domains.map(domain => (
        <div key={domain} className="mt-8">
          <div className="flex text-sm text-green-600 font-semibold uppercase mb-3">
            <SVGMidi className="mr-2" />
            {domain}
          </div>
          <table className="w-full border-t text-sm text-gray-700">
          {meta.filter(module => module.domain == domain).map((module, index) => (
            <tbody key={module._id}>
              <tr className={selection.includes(module._id) ? rowSelectedClass : rowClass}>
                <td className="w-8 p-2 align-top">{index +1}</td>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="flex-grow text-gray-700 font-medium">
                      {module.moduleName}
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer mr-3">
                        <span className="mr-2 text-gray-400 hover:text-gray-700">Select</span>
                        <input
                        defaultChecked={selection.includes(module._id)}
                        type="checkbox"
                        value={module._id}
                        onChange={e => {
                          if (e.target.checked) {
                            if (!selection.includes(module._id)) {
                              setSelection(sel => ([
                                ...sel, module._id
                              ]))
                            }
                          } else {
                            setSelection(selection.filter(sel => sel !== module._id))
                          }
                        }}
                        className={(isEditing ? 'text-yellow-500' : 'text-gray-500') + ` rounded-sm bg-gray-50s border border-gray-200`} />
                      </label>
                      {!vStack.includes(module._id) &&
                        <ButtonExpanderRight clickHandler={e => {
                          if (!vStack.includes(module._id)) {
                            setVStack(vs => ([ ...vs, module._id]))
                          }
                        }}
                        />
                      }

                      {vStack.includes(module._id) &&
                        <ButtonExpanderDown clickHandler={e => {
                          setVStack(vStack.filter(vs => vs !== module._id))
                        }}
                        />
                      }
                    </div>
                  </div>
                </td>
              </tr>
              {vStack.includes(module._id) && (
                <tr key={module._id}
                  className={rowClass}
                >
                  <td className="w-8 p-2 align-top"></td>
                  <td className="p-2 pb-3">
                    <div className="text-gray-500 text-xs mt-1 mr-4">
                      {module.description}
                    </div>
                    <div className="flex text-green-600 text-xs mt-3 mr-4">
                      <SVGFamily />
                      <span className="text-gray-800 ml-2">{module.remark}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          ))}
          </table>
        </div>
      ))}
      <div className="text-center mt-5 mb-10">
        <div className="h-2 mb-5">
          {submitting && <div className="h-1 rounded-full border border-gray-400 opacity-50"
            style={{ backgroundImage: 'url(/mango-in-progress-01.gif)' }}
          ></div>}
        </div>
        <button
          onClick={submitSelection}
          className="inline-flex items-center justify-center text-sm font-medium px-5 py-2 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          Save Project Modules
        </button>
      </div>
    </div>
  )
}