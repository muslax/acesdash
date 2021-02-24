import PageLoading from '@components/PageLoading'
import PageNotFound from '@components/PageNotFound'
import { usePersonae, useProject, useProjectGroups, useUsers } from '@lib/hooks'
import useUser from '@lib/hooks/useUser'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import create from 'zustand'
import TablePersonae from './TablePersonae'
import Hero from './Hero'
import ProjectHasNoGroup from './ProjectHasNoGroup'
import ProjectHasNoPersona from './ProjectHasNoPersona'

/*/
 * /api/get?q=get-groups
 * &pid=602398bf98769600088c4c87
 * &field=groupName
 * &field=modules.metaId
 * &field=modules.moduleName
/*/

export default function Personae() {
  // const { user } = useUsers()
  const router = useRouter()
  const { pid } = router.query
  const { personae, isLoading, isError, mutate } = usePersonae(pid)
  const { project, isLoading: projectLoading, isError: projectError } = useProject(pid)

  const [modules, setModules] = useState({})
  const [groups, setGroups] = useState({})
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (project) {
      let _modules = {}
      const _groups ={}
      project.groups.forEach(({ _id, groupName, modules }) => {
        modules.forEach(module => {
          if (!_modules[module.metaId]) {
            _modules[module.metaId] = module.moduleName
          }
          if (!_groups[_id]) {
            _groups[_id] = groupName
          }
        })
      })

      setModules(_modules)
      setGroups(_groups)
    }
  }, [project])

  if (isLoading || projectLoading) return <PageLoading />

  if (isError || projectError) return <PageNotFound />

  if (project.groups.length == 0) return <ProjectHasNoGroup project={project} />

  if (personae.length == 0) return <ProjectHasNoPersona project={project} />

  return (
    <>
      <Hero project={project}
        subTitle1={project.title}
        subTitle2={project.client.name}
      />
      <div className="aces-wrap">
        <div className="aces-geist">
        {/* <pre>
          {JSON.stringify(project.groups, null, 2)}
        </pre> */}
          <TableFilter project={project} groups={project.groups} setFilter={setFilter} />
          {/* <pre>
            {JSON.stringify(groups, null, 2)}
          </pre> */}
          <TablePersonae
            projectAdmin={project.admin}
            store={useStore}
            groups={groups}
            modules={modules}
            personae={personae}
            filter={filter}
          />
        </div>
      </div>
    </>
  )
}

const TableFilter = ({ project, groups, setFilter }) => {
  const { user } = useUser()

  function isAdmin() {
    return project.admin == user?.username
  }
  return (
    <div className="flex flex-row justify-center md:items-center -mt-2 mb-3">
      <div className="md:flex-grow text-center md:text-left mr-4">
        <select onChange={e => setFilter(e.target.value)} className="text-sm py-1 rounded border-gray-300 hover:border-gray-400 shadow-sm hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="">All groups</option>
          {groups.map(({ _id, groupName }) => (
            <option key={_id} value={_id}>{groupName}</option>
          ))}
        </select>
      </div>
      {/* <Link href={`/projects/${project?._id}/new-persona`}> */}
      <div className="text-center md:text-left">
        {isAdmin() && (
          <>
            <Link href={`/projects/${project?._id}/persona?task=add`}>
              <a className="inline-flex text-sm px-3 py-1 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">Add</a>
            </Link>
            <Link href={`/projects/${project?._id}/persona?task=import`}>
              <a className="inline-flex text-sm ml-2 px-3 py-1 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">Import CSV</a>
            </Link>
          </>
        )}
        {/* {!isAdmin() && (
          <div className="text-xs">
            Editing hanya dapat dilakukan oleh admin proyek.
          </div>
        )} */}
      </div>
    </div>
  )
}

const useStore = create((set, get) => ({
  showStack: [],
  editStack: [],
  dirtyStack: [],
  deleteStack: [],
  setShow: (id) => set((state) => ({
    showStack: [...state.showStack, id]
  })),
  hide: (id) => set((state) => ({
    showStack: state.showStack.filter((item) => item !== id)
  })),
  setEdit: (id) => set((state) => ({
    editStack: [...state.editStack, id]
  })),
  setEditNot: (id) => set((state) => ({
    editStack: state.editStack.filter((item) => item !== id)
  })),
  setDirty: (idPlusField) => set((state) => ({
    dirtyStack: [...state.dirtyStack, idPlusField]
  })),
  cleanUp: (idPlusField) => set((state) => ({
    dirtyStack: state.dirtyStack.filter((item) => item !== idPlusField)
  })),
  checkDirtyById: (id) => {
    const dirties = get().dirtyStack
    dirties.some((item) => {
      if (item.includes(id)) {
        return true
      }
    })

    return false
  },
  countDirtyById: (id) => {
    let len = 0
    const dirties = get().dirtyStack
    dirties.some((item) => {
      if (item.includes(id)) {
        len = len + 1
      }
    })

    return len
  },
  cleanUpById: (id) => set((state) => ({
    dirtyStack: state.dirtyStack.filter((item) => !item.includes(id))
  })),
  setDelete: (id) => set((state) => ({
    deleteStack: [...state.deleteStack, id]
  })),
  setDeleteNot: (id) => set((state) => ({
    deleteStack: state.deleteStack.filter((item) => item !== id)
  })),
}))