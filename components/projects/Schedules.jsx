import PageLoading from "@components/PageLoading"
import { SVGModules } from "@components/SVGIcon"
import { SVGProfile } from "@components/SVGIcon"
import { SVGGroup } from "@components/SVGIcon"
import { useModulesMeta, usePersonaeWithShedules, useProjectGroups } from "@lib/hooks"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { jsonToCSV } from "react-papaparse"

const DISCUSSION_ID = '6026c27f985b1417b005d374'
const INTERVIEW_ID = '6026c27f985b1417b005d375'

export default function Schedules({ user }) {
  const router = useRouter()
  const { pid } = router.query
  // const { meta, isLoading: metaLoading, isError: metaError } = useModulesMeta(['domain', 'method', 'moduleName'], 'guided')
  const { groups, isLoading: groupsLoading, isError: groupsError } = useProjectGroups(pid, 'groupName')
  const { personae, isLoading, isError } = usePersonaeWithShedules(pid)

  if (isLoading || groupsLoading || isError || groupsError) return <PageLoading />

  return (
    <div className="-mt-2">
      <div className="flex items-center border-bs border-gray-200 pb-2 mb-2">
        <div className="flex-grow text-2xl text-green-600">
          Project Schedules
        </div>
      </div>
      {personae.length === 0 && (
        <div className="text-sm text-gray-600">
          Tidak/belum ada daftar peserta yang memerlukan penjadwalan.
        </div>
      )}

      {personae && personae.length > 0 && <TablePersonae groups={groups} personae={personae} />}
      {/* <pre>
        {JSON.stringify(meta, null, 2)}<br/>
        {JSON.stringify(groups, null, 2)}<br/>
        {JSON.stringify(personae, null, 2)}<br/>
      </pre> */}
    </div>
  )
}

function TablePersonae({ groups, personae }) {
  const [filter, setFilter] = useState('')
  const [containerHeight, setContainerHeight] = useState(0)
  const [groupsKV, setGroupsKV] = useState({})

  useEffect(() => {
    if (groups) {
      const obj = {}
      groups.forEach(group => {
        if (!obj[group._id]) {
          obj[group._id] = group.groupName
        }
      });

      setGroupsKV(obj)
    }
  },[groups])

  useEffect(() => {
    const table = document.getElementById('main-table')
    if (personae?.length > 0 && table) {
      const h = document.querySelector('#main-table tbody tr:first-child').clientHeight
      setContainerHeight((h * 11) + 1)
    }
  }, [personae])

  function expandOrCollapse() {
    const elm = document.getElementById('main-table-container')
    if (elm.classList.contains('collapsed')) {
      elm.classList.remove('collapsed')
    } else {
      elm.classList.add('collapsed')
    }
  }

  return (
    <div>
      <div className="flex items-center text-sm text-gray-500 mb-5">
        <div className="mr-4">
          <select onChange={e => setFilter(e.target.value)} className="text-sm py-1 rounded border-gray-300 hover:border-gray-400 shadow-sm hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option value="">All groups</option>
            {groups.map(({ _id, groupName }) => (
              <option key={_id} value={_id}>{groupName}</option>
            ))}
          </select>
        </div>
        <div className="flex uppercase mr-4">
          <SVGProfile className="text-purple-500 mr-1" />
          <span>Persona:</span>
          <span className="ml-1 text-gray-800 font-semibold">
            {personae.filter(p => p.group.includes(filter)).length}
          </span>
        </div>
      </div>
      <div id="main-table-container" className="collapsed rounded border border-blue-200 overflow-auto">
        <table id="main-table" className="w-full text-sm text-gray-700">
          <thead>
            <tr className="">
              <th className="font-medium text-left w-10 p-0">
                <span className="bg-blue-100 block p-2 border-b border-blue-200">#</span>
              </th>
              <th className="font-medium text-left p-0">
                <span className="bg-blue-100 block p-2 border-b border-blue-200">Nama lengkap</span>
              </th>
              <th className="font-medium text-left w-16 p-0">
                <span className="bg-blue-100 block p-2 border-b border-blue-200">Group</span>
              </th>
              <th className="font-medium text-left w-16 p-0">
                <span className="bg-blue-100 block p-2 border-b border-blue-200">Diskusi</span>
              </th>
              <th className="font-medium text-left w-20 p-0">
                <span className="bg-blue-100 block p-2 border-b border-blue-200">Wawancara</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {personae.filter(p => p.group.includes(filter)).map(({
              _id: id, username, fullname, group, sims
            }, index) => (
              <tr key={id} className={index === 0 ? '' : 'border-t border-blue-100'}>
                <td className="p-2 w-8">{index + 1}</td>
                <td className="p-2">{fullname}</td>
                <td className="p-2 whitespace-nowrap">{groupsKV[group]}</td>
                <td className="text-center p-2">{sims.includes(DISCUSSION_ID) ? 'Ya' : '-'}</td>
                <td className="text-center p-2">{sims.includes(INTERVIEW_ID) ? 'Ya' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex ml-8">
        <button
          onClick={expandOrCollapse}
          className="block leading-0 text-xs px-2 py-1 bg-blue-200 rounded-b-sm"
        >
          Expand/Collapse
        </button>
      </div>
      <style jsx>{`
      #main-table-container.collapsed {
        height: ${containerHeight}px;
      }
      table {
        border-collpase: collapse;
      }
      th {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 2;
      }

      th[scope=row] {
        position: -webkit-sticky;
        position: sticky;
        left: 0;
        z-index: 1;
      }
      `}</style>
    </div>
  )
}