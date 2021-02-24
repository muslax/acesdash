import { MENU } from "@lib/constants";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProjectSidebar() {
  const router = useRouter()
  const { pid } = router.query

  const [sidebarPos, setSidebarPos] = useState(0)
  const [topNavHeight, setTopNavHeight] = useState(0)
  const [projectNavHeight, setProjectNavHeight] = useState(0)

  useEffect(() => {
    const h0 = document.getElementById('project-sidebar').offsetTop
    const h1 = document.getElementById('aces-top').clientHeight
    const h2 = document.getElementById('aces-nav').clientHeight
    setSidebarPos(h0)
    setTopNavHeight(-h1)
    setProjectNavHeight(-h2)
  }, [])

  useScrollPosition(({ prevPos, currPos }) => {
    // const el = document.getElementById('ribbon')
    const sidebar = document.getElementById('project-sidebar')
    if (currPos.y < topNavHeight) {
      // el.classList.add('scrolled')
      sidebar.classList.add('scrolled')
    } else {
      // el.classList.remove('scrolled')
      sidebar.classList.remove('scrolled')
    }
  })

  const links = [
    {text: MENU.PROJECT_INFO, href: `/projects/${pid}/info`},
    {text: MENU.PROJECT_MODULES, href: `/projects/${pid}/modules`},
    {text: MENU.PROJECT_GUESTS, href: `/projects/${pid}/guests`},
    {text: MENU.PROJECT_SCHEDULES, href: `/projects/${pid}/schedules`},
    {text: MENU.PROJECT_DEPLOYMENT, href: `/projects/${pid}/deployment`},
  ]

  const base = "font-semibold px-4 sm:px-0 py-6 sm:py-3 border-b "
  const normal = base + "hover:text-green-600"
  const active = base + "text-green-600 hover:text-green-700 border-green-500"

  return (
    <div className="text-sm text-gray-700">
      {router.asPath.endsWith("/settings") && (
        <div className="bg-white text-xl leading-loose font-semibold">
          <p className="border-b -mt-10s -mx-4 px-4 pb-4 sm:hidden">
            Project Settings
          </p>
        </div>
      )}
      <div id="project-sidebar" className="sticky flex flex-col -mx-4 sm:mx-0 sm:w-36 leading-base">
        {/* <div className="fixed"> */}
        {links.map(({ text, href }) => (
          <Link key={href} href={href}>
            <a
              className={router.asPath.endsWith(href) ? active : normal}
            >
              {text}{router.asPath.endsWith(href) && <span className="text-gray-300">&nbsp; &rarr;</span>}
            </a>
          </Link>
        ))}
        {/* </div> */}
      </div>
      <style jsx>{`
      #project-sidebar.scrolled {
        position: fixed;
        top: ${sidebarPos + 0 + topNavHeight}px;
      }
      `}</style>
    </div>
  )
}