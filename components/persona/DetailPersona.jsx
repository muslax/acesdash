import { SVGPencil } from "@components/SVGIcon"
import { SVGLock } from "@components/SVGIcon"
import fetchJson from "@lib/fetchJson"
import { usePersona } from "@lib/hooks"
import { useEffect, useState } from "react"

export default function DetailPersona({ canEdit, store, groups, meta, person, flag, setFlag }) {
  const { persona, isLoading, isError, mutate } = usePersona(person._id)
  const {
    editStack, setEdit, setEditNot,
    dirtyStack, countDirtyById, cleanUpById, cleanUp,
    deleteStack, setDelete, setDeleteNot,
  } = store()

  const [dummy, setDummy] = useState(persona ?? person)
  const [submitting, setSubmitting] = useState(null)

  useEffect(() => {
    if (persona) {
      setDummy(persona)
    }

    cleanUpById(person._id)
  }, [persona])

  if (isLoading || isError) return <>.............</>

  const fieldProps = {
    store: store,
    proxy: persona,
    model: dummy,
    modifier: setDummy,
  }

  async function handleEdit(e) {
    setSubmitting('update-persona')
    setEditNot(person._id)

    let body = { id: person._id, packet: {} }

    dirtyStack.some((item) => {
      if (item.includes(person._id)) {
        const field = item.split('-')[1]
        const value = dummy[field]
        body.packet[field] = value
      }
    })

    cleanUpById(person._id)

    console.log('Update packet', body)
    const url = '/api/post?q=update-persona'
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })
    // setEditNot(person._id)
    console.log('Response', response)
    // mutatePersonae()
    mutate(`/api/get?q=get-personae&pid=${person.projectId}`)
    setSubmitting(null)
  }

  async function handleDelete(e) {
    let body = { id: person._id }
    console.log('body', body)
    const url = '/api/post?q=delete-persona'
    console.log('awaiting delete... ' + new Date().toLocaleString())
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })

    console.log('Done ' + new Date().toLocaleString())
    console.log('Response', response)
    // mutatePersonae()
    console.log('Mutating ' + new Date().toLocaleString())
    mutate(`/api/get?q=get-personae&pid=${person.projectId}`)
    console.log('Done ' + new Date().toLocaleString())
  }

  return (
    <div className="">
      {/* <pre>
        {JSON.stringify(editStack, null, 2)}<br/>
        {JSON.stringify(dirtyStack, null, 2)}
      </pre> */}
      <div className="flex flex-wrap">
        <div className="pr-4">
          <table className="text-xs">
            <tbody>
              <tr>
                <td width="110"></td>
                <td style={{ minWidth: '200px' }}></td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">Username:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} disabled={true} field="username" />
                </td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">Nama lengkap:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} field="fullname" max={32} />
                </td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">Jenis kelamin:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} field="gender" max={9} />
                </td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">Tanggal lahir:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} field="birth" max={10} />
                </td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">Email:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} field="email" max={32} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-96s">
          <table className="text-xs w-full">
            <tbody>
              <tr>
                <td width="110"></td>
                <td style={{ minWidth: '160px' }}></td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">Telepon / HP:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} field="phone" max={32} />
                </td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">NIP / NIK:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} field="nip" max={32} />
                </td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">Posisi/jabatan:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} field="position" max={32} />
                </td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">Level sekarang:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} field="currentLevel" max={32} />
                </td>
              </tr>
              <tr>
                <td className="text-right py-1 pr-2 whitespace-nowrap">Level ditargetkan:</td>
                <td className="py-1">
                  <EditableField fieldProps={fieldProps} field="targetLevel" max={32} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <table className="w-full text-xs mt-3">
        <tbody>
          <tr className="border-t">
            <td width="110" className="text-right align-top py-3">Group:</td>
            <td className="align-top py-3 pl-2">
              {groups[persona.group]}
            </td>
          </tr>
          <tr className="border-t">
            <td width="110" className="text-right align-top py-3">ACES Modules:</td>
            <td className="align-top py-3 pl-2">
              {parseTests(persona?.tests, meta)}
            </td>
          </tr>
          <tr className="border-t">
            <td width="110" className="text-right align-top py-3">ACES Simulations:</td>
            <td className="align-top py-3 pl-2">
              {parseTests(persona?.sims, meta)}
            </td>
          </tr>
          {/* <tr className="border-t">
            <td width="110" className="align-top py-3">ACES Simulations</td>
            <td className="align-top py-3 pl-3">
              ASAS
            </td>
          </tr> */}

          {submitting == 'update-persona' && (
            <tr className="border-t">
              <td colSpan="2" className="text-center py-3">
                Wait...
              </td>
            </tr>
          )}

          {(!submitting && canEdit
            && !editStack.includes(persona._id)
            && !deleteStack.includes(persona._id))
            && (
            <tr className="border-t">
              <td colSpan="2" className="align-top py-3">
                <button onClick={e => setDelete(persona._id)}
                  className="mr-3 rounded-sm bg-gray-400 text-white border border-gray-400 px-1 py-px hover:bg-gray-500 hover:bg-opacity-75 hover:shadow hover:border-gray-500 focus:outline-none active:border-gray-500 active:bg-gray-500 active:bg-opacity-100 active:text-gray-100"
                >&nbsp;Delete&nbsp;</button>
                <button onClick={e => setEdit(persona._id)}
                  className="rounded-sm bg-gray-400 text-white border border-gray-400 px-1 py-px hover:bg-gray-500 hover:bg-opacity-75 hover:shadow hover:border-gray-500 focus:outline-none active:border-gray-500 active:bg-gray-500 active:bg-opacity-100 active:text-gray-100"
                >&nbsp;&nbsp; Edit &nbsp;&nbsp;</button>
              </td>
            </tr>
          )}

          {deleteStack.includes(persona._id) && (
          <tr className="border-t">
            <td></td>
            <td className="py-3 pl-3">
              {/* <p className="mb-3">
                Lorem ipsyum solor sys amet
              </p> */}
              <div>
                <button onClick={handleDelete}
                  className="rounded-sm border border-purple-400 px-2 py-1 mr-2 hover:shadow hover:border-purple-500 focus:outline-none active:border-purple-500 active:bg-purple-500 text-purple-500 active:text-gray-100"
                >Delete Persona</button>
                <button onClick={e => setDeleteNot(persona._id)}
                  className="rounded-sm border border-purple-400 px-2 py-1 hover:shadow hover:border-purple-500 focus:outline-none active:border-purple-500 active:bg-purple-500 text-purple-500 active:text-gray-100"
                >Cancel</button>
              </div>
            </td>
          </tr>)}

          {editStack.includes(persona._id) && (
          <tr className="border-t">
            <td></td>
            <td className="py-3 pl-3">
                {/* <p className="mb-3">
                  Hola halibu!
                </p> */}
                <div>
                {/* {!checkDirtyById(persona._id) && ( */}
                {countDirtyById(persona._id) === 0 && (
                  <div>
                    <button disabled
                    className="rounded-sm border border-gray-200 px-2 py-1 mr-2 text-gray-300"
                    >Save Changes</button>
                    <button onClick={e => {
                      setEditNot(persona._id)
                    }}
                    className="rounded-sm border border-red-300 px-2 py-1 hover:shadow hover:border-red-400 focus:outline-none active:border-red-400 active:bg-red-400 text-red-400 active:text-gray-100"
                    >Cancel</button>
                  </div>
                )}
                {countDirtyById(dummy._id) > 0 && (
                  <div>
                    <button onClick={handleEdit}
                    className="rounded-sm border border-purple-400 px-2 py-1 mr-2 hover:shadow hover:border-purple-500 focus:outline-none active:border-purple-500 active:bg-purple-500 text-purple-500 active:text-gray-100"
                    >Save Changes</button>
                    <button onClick={e => {
                      cleanUpById(persona._id)
                      setDummy(persona)
                      setEditNot(persona._id)
                      setFlag(!flag)
                    }}
                    className="rounded-sm border border-red-300 px-2 py-1 hover:shadow hover:border-red-400 focus:outline-none active:border-red-400 active:bg-red-400 text-red-400 active:text-gray-100"
                    >Discard Changes</button>
                  </div>
                )}
              </div>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}

function parseTests(tests, meta) {
  console.log(tests)
  if (!tests) return ''
  let array = []
  tests.forEach(t => {
    if (meta[t]) {
      array.push(meta[t])
    }
  })
  // Object.keys(meta)

  return array.join(', ')
}

const EditableField = ({ fieldProps, field, disabled=false, min=16, max=36 }) => {
  const { store, proxy, model, modifier } = fieldProps
  const [editing, setEditing] = useState(false)
  const [shadow, setShadow] = useState(model[field])
  const { editStack, dirtyStack, setDirty, cleanUp } = store()

  function isDirty() { return shadow != proxy[field] }

  function isDisabled() { return disabled || !editStack.includes(model._id)}

  return (
    <div className="flex flex-row items-center text-xs text-gray-700">
      <button
      disabled={disabled ? disabled : !editStack.includes(model._id)}
      tabIndex="999"
      className="p-1 mr-1 focus:outline-none text-gray-500 hover:text-gray-800 hover:bg-gray-100"
      onClick={e => {
        if (editing) return

        document.querySelector(`.input-${field}`).focus()
        setEditing(true)
      }}
      >
        {!isDisabled() && (
          <div className="text-blue-500">
            <SVGPencil className="w-4 h-4"/>
          </div>
        )}
        {isDisabled() && (
          <div className="text-yellow-500">
            <SVGLock className="w-4 h-4"/>
          </div>
        )}
      </button>
      <span className={(editing ? 'hidden ' : 'inline-block ') + (isDirty() ? 'text-red-500' : '')}>{model[field] ? model[field] : '-'}</span>
      {!isDisabled() && <label data-value={shadow} className={(editing ? 'inline-grid ' : 'hidden inline-grid')}>
        <input
          autoFocus={true}
          type="text"
          value={shadow ? shadow : ''}
          size={min}
          maxLength={max}
          onChange={e => {
            setShadow(e.target.value)
          }}
          onBlur={e => {
            const val = e.target.value.trim()
            setShadow(val)
            if (modifier) {
              modifier(prev => ({
                ...prev, [field]: val
              }))
            }
            setEditing(!editing)
            // if (isDirty() && !dirtyStack.includes(`${proxy._id}-${field}`)) {
            const entry = `${proxy._id}-${field}`
            if (isDirty()) {
              if (!dirtyStack.includes(entry)) setDirty(entry)
            } else {
              cleanUp(entry)
            }
          }}
          className={`input-${field} text-xs focus:outline-none border-b border-gray-400 bg-gray-200 hover:bg-gray-100 focus:bg-blue-100 focus:border-blue-400`}
        />
      </label>}
      {/* <span className="len-notif text-gray-400 ml-2">{shadow?.length ? shadow?.length : ''}</span> */}
      <style jsx>{`
      label::after {
        content: attr(data-value) " ";
        visibility: hidden;
        height: 0;
        appearance: none;
        white-space: pre-wrap;
      }
      input {
        margin-right: -5px;
        padding: 3px 4px 2px;
      }
      .len-notif {
        font-size: 9px;
      }
      `}</style>
    </div>
  )
}