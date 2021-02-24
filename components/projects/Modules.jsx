import { ButtonExpanderDown } from "@components/buttons/ButtonExpander";
import { ButtonExpanderRight } from "@components/buttons/ButtonExpander";
import PageLoading from "@components/PageLoading";
import { SVGGear, SVGPlus, SVGGroup, SVGModules } from "@components/SVGIcon";
import { useProject, useProjectGroups, useProjectSimpleInfo } from "@lib/hooks";
import useUser from "@lib/hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GroupSetup from "./GroupSetup";

export default function Modules({ user }) {
  const router = useRouter()
  const { pid } = router.query
  const { projectSimpleInfo, isLoading: infoLoading, isError: infoError } = useProjectSimpleInfo(pid)
  const { groups, isLoading, isError, mutate } = useProjectGroups(pid)

  const [currentGroup, setCurrentGroup] = useState(null)
  const [uniqueModules, setUniqueModules] = useState([])

  useEffect(() => {
    if (groups) {
      const array = []
      groups.forEach(({ modules }) => {
        modules.forEach(({ moduleName }) => {
          if (!array.includes(moduleName )) {
            array.push(moduleName)
          }
        })
      })

      setUniqueModules(array)
    }
    return () => {}
  }, [groups])

  function isAdmin() {
    return user.username == projectSimpleInfo?.admin
  }

  // TODO
  if (isError || infoError) return <>ERROR</>

  if (isLoading || infoLoading) return <PageLoading />

  if (groups.length === 0) return <ProjectHasNoGroups isAdmin={isAdmin()} pid={pid} />

  if (currentGroup) return (
    <CreateOrEditGroup
      group={currentGroup}
      callback={() => {
        setCurrentGroup(null)
        window.scrollTo(0, 0)
      }}
    />
  )

  return (
    <Skeleton
      isAdmin={isAdmin()}
      groups={groups}
      addGroupHandler={() => setCurrentGroup({
        projectId: pid,
        groupName: 'Group ' + (groups.length + 1),
        modules: []
      })}
    >
      <div className="flex items-center text-sm text-gray-500 mb-5">
        <div className="flex uppercase mr-4">
          <SVGGroup className="text-green-600 mr-1" />
          <span>Groups:</span>
          <span className="ml-1 text-gray-800 font-semibold">{groups.length}</span>
        </div>
        <div className="flex uppercase mr-4">
          <SVGModules className="text-purple-500 mr-1" />
          <span>Modules:</span>
          <span className="ml-1 text-gray-800 font-semibold">{uniqueModules.length}</span>
        </div>
      </div>
      {groups.map(group => (
        <ProjectGroup
          key={group._id}
          user={user}
          project={projectSimpleInfo}
          group={group}
          editCallback={setCurrentGroup}
        />
      ))}
    </Skeleton>
  )
}

function Skeleton({ children, ...props }) {
  const isAdmin = props.isAdmin

  return (
    <div className="-mt-2">
      <div className="flex items-center border-bs border-gray-200 pb-2 mb-2">
        <div className="h-9 pt-1 flex-grow text-2xl text-green-600 -font-medium -mb-p">
          Groups & Modules
        </div>
        {isAdmin && props.noButton === undefined && (
          <button
            onClick={props.addGroupHandler}
            className="inline-flex items-center bg-gray-50 text-sm text-gray-600 font-mediums leading-loose pl-2 pr-4 py-1 focus:outline-none hover:bg-gray-200 focus:bg-gray-300 active:bg-gray-100"
          >
            <SVGPlus className="w-4 h-4 mr-1"/>
            Add Group
          </button>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

function ProjectGroup({ user, project, group, editCallback }) {
  const [viewStack, setViewStack] = useState([])

  function canEdit() {
    return user.username === project.admin
  }

  return (
    <div className="max-w-xl mx-auto sm:mx-0 mb-9">
      <div className="rounded border border-gray-300 shadow-sm">
        <div className="flex items-center px-3 py-2 border-b">
          <h3 className="flex-grow text-lgs text-gray-600 leading-snug font-semibold">
            {group.groupName}
          </h3>
          {canEdit() && <button
            onClick={e => {
              window.scrollTo(0, 0)
              editCallback(group)
            }}
            className="text-gray-400 hover:text-yellow-500 focus:outline-none active:text-300 w-5 h-5"
          >
            <SVGGear className="" />
          </button>}
          {!canEdit() && <button
            className="text-gray-300 focus:outline-none active:text-300 w-5 h-5"
          >
            <SVGGear className="" />
          </button>}
        </div>
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-400 bg-opacity-75 text-gray-600 font-medium border-b border-gray-500 border-opacity-25">
              <td className="w-9 text-center p-2">#</td>
              <td className="p-2">Module Name</td>
              <td className="p-2 text-right">Type / Domain</td>
              <td className="w-8 text-center p-2">&nbsp;</td>
            </tr>
          </thead>
          {group.modules.map(({ metaId, domain, method, moduleName, description, remark }, index) => (
            <tbody key={metaId}>
              {!viewStack.includes(`${group._id}-${metaId}`) && (
                <tr className={(index == 0 ? '' : 'border-t border-gray-200') + ' hover:text-gray-500'}>
                  <td className="text-center p-2">{index +1}</td>
                  <td className="p-2">{moduleName}</td>
                  <td className="p-2 text-right">{domain}</td>
                  <td className="text-center p-2">
                    <div className="flex justify-end">
                      <ButtonExpanderRight clickHandler={e => {
                        const key = `${group._id}-${metaId}`
                        if (!viewStack.includes(key)) {
                          setViewStack(ss => ([...ss, key]))
                        }
                      }}/>
                    </div>
                  </td>
                </tr>
              )}
              {viewStack.includes(`${group._id}-${metaId}`) && (
                <tr className={(index == 0 ? '' : 'border-t border-gray-200')}>
                  <td className="text-center p-2">{index +1}</td>
                  <td colSpan="2" className="p-2">{moduleName}</td>
                  <td className="text-center p-2">
                    <div className="flex justify-end">
                      <ButtonExpanderDown clickHandler={e => {
                        const key = `${group._id}-${metaId}`
                        setViewStack(viewStack.filter((ss) => { return ss !== key }))
                      }}/>
                    </div>
                  </td>
                </tr>
              )}
              {viewStack.includes(`${group._id}-${metaId}`) && (
                <tr className="bg-gray-300 bg-opacity-50 border-t border-b border-gray-300 border-opacity-75">
                  <td></td>
                  <td colSpan="3" className="text-xs p-2 pr-4">
                    <div className="flex flex-row items-start">
                      <div className="flex-none w-24 text-gray-500 uppercase">Domain</div>
                      <p className="flex-grow font-bold">{domain}</p>
                    </div>
                    <div className="flex flex-row items-start mt-2">
                      <span className="flex-none w-24 text-gray-500 uppercase">Description</span>
                      <p className="flex-grow text-xs">{description}</p>
                    </div>
                    <div className="flex flex-row items-start mt-2 mb-2">
                      <span className="flex-none w-24 text-gray-500 uppercase">Remark</span>
                      <p className="flex-grow text-xs">{remark}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  )
}

function ProjectHasNoGroups({ isAdmin, pid }) {
  const [group, setGroup] = useState(null)

  if (group) return (
    <CreateOrEditGroup
      group={group}
      callback={() => {
        setGroup(null)
        window.scrollTo(0, 0)
      }}
    />
  )

  return (
    <Skeleton isAdmin={isAdmin} noButton>
      <div className="max-w-xl mx-auto sm:mx-0 mb-9">
        <div className="h-36s rounded border border-yellow-300 hover:shadow-sm">
          <h3 className="text-xl text-gray-700 text-center m-4">
            Belum ada modul ACES yang terinstal.
          </h3>
          <p className="text-gray-500 text-sm text-center mx-10 my-4">
            Bila Anda administartor proyek ini, tekan tombol di bawah ini untuk
            memilih modul apa saja yang akan dipakai dalam proyek ini.
          </p>
          <div className="text-center m-6 mt-10">
            <button
              disabled={!isAdmin}
              onClick={e => setGroup({
                projectId: pid,
                groupName: 'Group 1',
                modules: []
              })}
              className="inline-flex items-center border hover:border-gray-300 text-gray-600 leading-loose px-4 py-1 focus:outline-none hover:bg-white hover:shadow-sm focus:bg-green-50 active:border-green-500"
            >
              Select ACES Modules
            </button>
          </div>
        </div>
      </div>
    </Skeleton>
  )
}

function CreateOrEditGroup({ group, callback }) {
  const isNew = group?._id ? false : true
  const titleCreate = `${group.groupName}: Select ACES Modules`
  const titleEdit = `${group.groupName}: Edit Modules Selection`
  const borderCreate = `border-green-500`
  const borderEdit = `border-yellow-600 border-opacity-50`

  return (
    <Skeleton noButton>
      <div className="max-w-xl mx-auto sm:mx-0 mb-9">
        <div
          className={`rounded shadow-sm px-4 py-4 pt-6 border ` + (isNew ? borderCreate : borderEdit)}
        >
          <div className="flex flex-row items-end mb-6">
            <div className="flex-grow text-xl text-gray-600 font-medium">
              {isNew ? titleCreate : titleEdit}
            </div>
            <div>
              <button onClick={callback}
              className="rounded hover:shadow-sm text-sm text-gray-300 hover:text-gray-500 border border-gray-300 px-3 py-1">Cancel</button>
            </div>
          </div>

          <div className="-mx-4 px-4 bg-yellow-300s bg-opacity-75 mb-2">
            <div className="bg-gray-100 py-2 pl-3 border-l-4 text-xs border-red-400">
              New group selection warning
            </div>
          </div>
          <GroupSetup
            group={group}
            isEditing={!isNew}
            callback={callback}
          />
        </div>
      </div>
    </Skeleton>
  )
}