import ButtonExpander from "@components/buttons/ButtonExpander"
import useUser from "@lib/hooks/useUser"
import { useState } from "react"
import DetailPersona from "./DetailPersona"

export default function TablePersonae({ projectAdmin, store, groups, modules, personae, filter }) {
  const { user } = useUser()
  const {
    showStack, setShow, hide,
    setEditNot, setDeleteNot,
    dirtyStack, editStack,
    cleanUpById, countDirtyById,
  } = store()

  const [flag, setFlag] = useState(false)

  function isProjectAdmin() {
    return user?.username == projectAdmin
  }

  return (
    <>
      <pre>
        {/* {JSON.stringify(showStack, null, 2)} */}
      </pre>
      <table className="w-full text-sm text-gray-700">
        <thead>
            <tr className="text-gray-50 font-medium">
              <td className="bg-green-600 bg-opacity-75 w-10 rounded-tl text-center p-2">#</td>
              <td className="bg-green-600 bg-opacity-75 p-2 border-l border-green-700 border-opacity-25">Full Name</td>
              <td className="bg-green-600 bg-opacity-75 w-14 p-2 border-l border-green-700 border-opacity-25 text-center">Tests</td>
              <td className="bg-green-600 bg-opacity-75 w-14 p-2 border-l border-green-700 border-opacity-25 text-center">Sims</td>
              <td className="bg-green-600 bg-opacity-75 w-16 p-2 border-l border-green-700 border-opacity-25">Report</td>
              <td className="bg-green-600 bg-opacity-75 w-10 rounded-tr p-2 border-l border-green-700 border-opacity-25">&nbsp;</td>
            </tr>
          </thead>
          {personae.filter(p => p.group.includes(filter)).map((person, index) => (
            <tbody key={person._id}>
            {!showStack.includes(person._id) && (
              <tr className="border-b border-gray-200 border-opacity-50 hover:bg-green-50">
                <td className="p-2 text-center">{index + 1}</td>
                <td className="p-2 border-l border-gray-100 border-opacity-50">{person.fullname}</td>
                <td className="p-2 border-l border-gray-100 border-opacity-50 text-center font-medium">
                  <span className="text-gray-600">{person._tests}</span>
                  <span className="mx-1 text-gray-400">:</span>
                  <span className="text-green-600">{person._testsPerformed}</span>
                </td>
                <td className="p-2 border-l border-gray-100 border-opacity-50 text-center font-medium">
                  <span className="text-gray-600">{person._sims}</span>
                  <span className="mx-1 text-gray-400">:</span>
                  <span className="text-green-600">{person._simsPerformed}</span>
                </td>
                <td className="p-2 border-l border-gray-100 border-opacity-50 text-center">-</td>
                <td className="p-2 border-l border-gray-100 border-opacity-50">
                  <div className="flex">
                    <ButtonExpander clickHandler={e => {
                      if (!showStack.includes(person._id)) {
                        setShow(person._id)
                      } else {
                        hide(person._id)
                      }
                    }} />
                  </div>
                </td>
              </tr>
            )}
            {showStack.includes(person._id) && (
              <tr className="bg-gray-100 border-b border-gray-200 border-opacity-50">
                <td className="p-2 text-center">{index + 1}</td>
                <td colSpan="3" className="p-2 border-l border-gray-100 border-opacity-50">
                  {person.fullname}
                </td>
                <td className="p-2 text-right">&nbsp;</td>
                <td className="p-2 border-ls border-gray-100 border-opacity-50">
                  {countDirtyById(person._id) === 0 && <div className="flex">
                    <ButtonExpander initialState={true} clickHandler={e => {
                      cleanUpById(person._id)
                      setEditNot(person._id)
                      setDeleteNot(person._id)
                      hide(person._id)
                    }} />
                  </div>}
                </td>
              </tr>
            )}
            {showStack.includes(person._id) && (
              <tr className="border-b border-gray-200 border-opacity-75s bg-gray-50 bg-opacity-50 text-xs">
                <td className="p-2"></td>
                <td colSpan="5" className="pl-2 pr-5 py-3">
                  {/* <pre>
                    {JSON.stringify(editStack, null, 2)}<br/>
                    {JSON.stringify(dirtyStack, null, 2)}
                  </pre> */}
                  {flag && <DetailPersona
                    canEdit={isProjectAdmin()}
                    groups={groups}
                    store={store}
                    flag={flag}
                    setFlag={setFlag}
                    person={person}
                    meta={modules}
                  />}
                  {!flag && <DetailPersona
                    canEdit={isProjectAdmin()}
                    groups={groups}
                    store={store}
                    flag={flag}
                    setFlag={setFlag}
                    person={person}
                    meta={modules}
                  />}
                </td>
              </tr>
            )}
            </tbody>
          ))}
      </table>
    </>
  )
}