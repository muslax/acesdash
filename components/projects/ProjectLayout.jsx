import BackToSettings from "@components/BackToSettings"
import { useProjectSimpleInfo } from "@lib/hooks"
import { useScrollPosition } from "@n8tb1t/use-scroll-position"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "./ProjectSidebar"

export default function ProjectLayout({ children, isIndex = false }) {
  const router = useRouter()
  const { pid } = router.query
  const { projectSimpleInfo, isLoading, isError } = useProjectSimpleInfo(pid)

  if (isIndex) return (
    <>
      {/* <ProjectRibbon info={projectSimpleInfo} /> */}
      <div className="aces-wrap">
        <div className="aces-geist">
          <div className="flex flex-row">
            <div className="w-full sm:w-36 pt-5">
              <ProjectSidebar />
            </div>
            <div className="hidden sm:block flex-grow sm:pl-8 md:pl-10 pt-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
  return (
    <>
      {/* <ProjectRibbon info={projectSimpleInfo} /> */}
      <div className="aces-wrap">
        <div className="aces-geist">
          <div className="flex flex-row">
            <div className="hidden sm:block sm:w-36 pt-5">
              <ProjectSidebar />
            </div>
            <div className="flex-grow">
              <BackToSettings text="Back to Settings" href={`/projects/${pid}/settings`} />
              <div className="sm:pl-8 md:pl-10 pt-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ProjectRibbon({ info }) {
  const [topNavHeight, setTopNavHeight] = useState(0)
  const [projectNavHeight, setProjectNavHeight] = useState(0)

  useEffect(() => {
    const h1 = document.getElementById('aces-top').clientHeight
    const h2 = document.getElementById('aces-nav').clientHeight
    setTopNavHeight(-h1)
    setProjectNavHeight(-h2)
  }, [])

  useScrollPosition(({ prevPos, currPos }) => {
    const el = document.getElementById('ribbon')
    // const sidebar = document.getElementById('project-sidebar')
    if (currPos.y < topNavHeight) {
      el.classList.add('scrolled')
      // sidebar.classList.add('scrolled')
    } else {
      el.classList.remove('scrolled')
      // sidebar.classList.remove('scrolled')
    }
  })

  // bg-green-500
  // text-green-50
  // text-gray-800 font-normal opacity-50
  return (
    <div id="ribbon" className="aces-wrap sticky bg-gray-500 border-bs border-gray-100">
      <div className="aces-geist text-xs text-gray-100 py-1">
        <div className="flex items-center">
          <div className="hidden sm:flex text-center sm:text-left flex-grow font-medium uppercase">
            <span className="text-gray-400 font-normal mr-1">Project: </span>
            {info ? info.title : '--'}
          </div>
          <div className="block sm:hidden text-center sm:text-left flex-grow font-medium uppercase">
            <span className="text-gray-400 font-normal mr-1">Project: </span>
            {info ? info.shortTitle : '-'}
          </div>
          <div className="hidden sm:block text-white">{info ? info.client.name : ''}</div>
        </div>
      </div>
      <style jsx>{`
      #ribbon {
        z-index: 999;
      }
      #ribbon.scrolled {
        top: ${-projectNavHeight}px;
        left: 0;
        width: 100%;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
      }
      `}</style>
    </div>
  )
}