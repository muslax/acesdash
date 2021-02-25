import { useRouter } from "next/router"
import fetchJson from "@lib/fetchJson"
import useUser from "@lib/hooks/useUser"
import Image from 'next/image'
import { API_ROUTES, MENU, ROUTES } from "@lib/constants"
import { ACESPurple } from "./AcesLogo"
import Link from "next/link"
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { useEffect, useState } from "react"
import { useLicense, useProjectSimpleInfo } from "@lib/hooks"
import { SVGProject } from "@components/SVGIcon"
import { ACESSVGPurple } from "./AcesLogo"

const LICENSE_NAV = [
  {text: MENU.ACES_HOME, href: ROUTES.Dashboard},
  {text: MENU.ACES_PROJECTS, href: ROUTES.Projects},
  {text: MENU.ACES_LICENSE, href: ROUTES.License},
]

export function AppHeader ({ isLoading }) {
  const { user, mutateUser } = useUser()
  const router = useRouter()
  const { pid } = router.query

  const { license, isLoading: licenseLoading, isError: licenseError } = useLicense()

  const [navHeight, setNavHeight] = useState(0)

  useEffect(() => {
    const h1 = document.getElementById('aces-top').clientHeight
    setNavHeight(-h1)
  }, [])

  useScrollPosition(({ prevPos, currPos }) => {
    const el = document.getElementById('aces-nav')
    if (currPos.y < navHeight) {
      el.classList.add('scrolled')
    } else {
      el.classList.remove('scrolled')
    }
  })

  if (isLoading || licenseLoading) return <><IsLoading /></>

  return (
    <>
      {!pid && <LicenseNav license={license} user={user} mutate={mutateUser} />}
      {pid && <ProjectNav license={license} user={user} mutate={mutateUser} />}
    </>
  )
}

function IsLoading() {
  return (
    <>
      <div id="aces-top" className="aces-wrap bg-white">
        <div className="aces-geist py-3">
          <div className="flex items-center">
            <div className="pr-3 mr-3 border-r border-gray-300">
              <Link href={ROUTES.Home}>
                <a className="inline-flex">
                  <ACESPurple />
                </a>
              </Link>
            </div>
            <div className="flex flex-grow">
              <Link href={ROUTES.Dashboard}>
                <a className="inline-flex items-center text-gray-700 hover:text-gray-900">
                  <div className="rounded-full bg-gray-100 w-7 h-7 mr-2">
                    &nbsp;
                  </div>
                </a>
              </Link>
            </div>
            <div className="flex items-center text-xs">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
      <div id="aces-nav" className="aces-wrap bg-white sticky top-0 border-b">
        <div className="aces-geist">
          &nbsp;
        </div>
      </div>
    </>
  )
}

function AppNav({ children, ...props }) {
  const router = useRouter()
  const license = props.license
  const user = props.user
  const project = props.project || null
  const mutate = props.mutate
  const isProjectAdmin = props.isProjectAdmin || false

  const handleLogout = async (e) => {
    e.preventDefault()

    // if (isLoading) return

    await mutate(fetchJson(API_ROUTES.Logout, {
      method: 'POST'
    }))

    router.push(ROUTES.Home)
  }

  return (
    <>
      <div id="aces-top" className="aces-wrap bg-white">
        <div className="aces-geist py-3">
          <div className="flex items-center">
            <div className="flex pr-3 mr-3 border-r border-gray-300">
              <Link href={ROUTES.Home}>
                <a className="inline-block">
                  {/* <ACESPurple /> */}
                  {/* <div className="flex flex-row text-gray-100 hover:text-white text-center text-sm font-bold leading-none">
                    <div className="rounded-full bg-purple-700 h-6 w-6 pt-1 z-50">a</div>
                    <div className="rounded-full bg-purple-600 h-6 w-6 pt-1 -ml-2 z-40">c</div>
                    <div className="rounded-full bg-purple-500 h-6 w-6 pt-1 -ml-2 z-30">e</div>
                    <div className="rounded-full bg-purple-500 bg-opacity-75 h-6 w-6 pt-1 -ml-2 z-20">s</div>
                  </div> */}
                  <ACESSVGPurple className="h-6" />
                </a>
              </Link>
            </div>
            <div className="flex flex-grow">
              <Link href={ROUTES.Dashboard}>
                <a className="inline-flex items-center text-gray-800 hover:text-gray-600">
                  <div className="rounded-full bg-gray-100 w-7 h-7 mr-2">
                    <Image
                      src={license?.logoUrl ?? user?.licenseLogo}
                      width={28}
                      height={28}
                      className="object-contain rounded-full w-7 h-7"
                    />
                  </div>
                  <span className="font-medium">
                    {user?.licenseName}
                  </span>
                </a>
              </Link>
            </div>
            <div className="flex items-center text-xs">
              <div className={`hidden sm:block font-medium mr-3 ` + (isProjectAdmin ? 'text-indigo-600' : 'text-gray-500')}>
                {user?.fullname ?? ''}
              </div>
              <div className="text-xs text-gray-600 leading-4">
                <Link href={API_ROUTES.Logout}>
                  <a
                    onClick={handleLogout}
                    className="inline-flex rounded bg-gray-100 hover:bg-indigo-500 hover:text-white px-2 py-1"
                  >
                    Logout
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="aces-nav" className="aces-wrap bg-white sticky border-b">
        <div className="aces-geist">
          <div className="flex items-center -ml-3">
            {children}
          </div>
        </div>
      </div>
      <style jsx>{`
      #aces-nav {
        z-index: 999;
      }
      #aces-nav.scrolled {
        top: 0;
        left: 0;
        width: 100%;
        border-bottom: 0 none;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.075);
      }
      `}</style>
    </>
  )
}

function LicenseNav({ license, user, mutate }) {
  const router = useRouter()
  const active = "px-3 text-indigo-600"
  const normal = "px-3 text-gray-600s hover:text-indigo-700"
  const spanNormal = "block py-3 -mb-px border-b-2 border-transparent"
  const spanActive = "block py-3 -mb-px border-b-2 border-indigo-500"

  return (
    <AppNav license={license} user={user} mutate={mutate}>
      <div className="flex items-center text-gray-800 text-xs uppercase font-medium tracking-tights">
        {LICENSE_NAV.map(({ text, href }, index) => (
          <Link key={href} href={href}>
            <a className={router.pathname == href ? active : normal}>
              <span className={ router.pathname == href ? spanActive : spanNormal }>
                {text}
              </span>
            </a>
          </Link>
        ))}
      </div>
      <div className="flex-grow text-right">
        &nbsp;
      </div>
    </AppNav>
  )
}

function ProjectNav({ license, user, mutate}) {
  const router = useRouter()
  const { pid } = router.query
  const { projectSimpleInfo, isLoading, isError } = useProjectSimpleInfo(pid)

  const active = "px-3 text-green-600"
  const normal = "px-3 text-gray-600s hover:text-green-600"
  const spanNormal = "block py-3 -mb-px border-b-2 border-transparent"
  const spanActive = "block py-3 -mb-px border-b-2 border-green-500"

  const links = [
    {text: MENU.PROJECT_HOME, href: `/projects/${pid}`},
    {text: MENU.PROJECT_PERSONA, href: `/projects/${pid}/persona`},
    {text: MENU.PROJECT_SETTINGS, href: `/projects/${pid}/settings`},
  ]

  const shouldShowProjectFlag = (
    !router.asPath.endsWith(pid)
    && !router.asPath.endsWith('/persona')
    && !router.asPath.includes('?')
  )

  const isProjectAdmin = user.username === projectSimpleInfo?.admin

  return (
    <AppNav license={license} user={user} isProjectAdmin={isProjectAdmin} mutate={mutate}>
      <div className="flex items-center text-gray-800 text-xs uppercase font-medium tracking-tights">
        {links.map(({ text, href }, index) => (
          <Link key={href} href={href}>
            <a className={router.asPath.endsWith(href) ? active : normal}>
              <span className={ router.asPath == href ? spanActive : spanNormal }>
                {text}
              </span>
            </a>
          </Link>
        ))}
      </div>
      <div className="flex-grow text-xs text-right text-gray-800 font-mediums">
        {projectSimpleInfo && shouldShowProjectFlag && (
          <div className="hidden sm:flex items-center text-gray-600 justify-end">
            <SVGProject className="w-4 h-4 text-green-600 mr-1" />
            <span className="block pt-px">{projectSimpleInfo.title}</span>
          </div>
        )}
      </div>
    </AppNav>
  )
}