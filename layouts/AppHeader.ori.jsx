import { useRouter } from "next/router"
import fetchJson from "@lib/fetchJson"
import useUser from "@lib/hooks/useUser"
import Image from 'next/image'
import { API_ROUTES, MENU, ROUTES } from "@lib/constants"
import { ACESPurple } from "./AcesLogo"
import Link from "next/link"
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { useEffect, useState } from "react"
import { useLicense } from "@lib/hooks"

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

  const handleLogout = async (e) => {
    if (isLoading) return

    e.preventDefault()
    await mutateUser(fetchJson(API_ROUTES.Logout, {
      method: 'POST'
    }))

    router.push(ROUTES.Home)
  }

  if (isLoading) return <><IsLoading /></>

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
              <div className="hidden sm:block text-indigo-600 font-medium mr-3">
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
            <div className="flex items-center text-gray-800 text-xs uppercase font-medium tracking-tights">
              {!pid && <LicenseNav />}
              {pid && <ProjectNav />}
            </div>
            <div className="flex-grow text-right">
              {pid && <>{pid}</>}
            </div>
          </div>
          {/* <div>ONTOSOROH</div> */}
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

function LicenseNav() {
  const router = useRouter()
  const active = "px-3 text-indigo-600"
  const normal = "px-3 text-gray-600s hover:text-indigo-700"
  const spanNormal = "block py-3 -mb-px border-b-2 border-transparent"
  const spanActive = "block py-3 -mb-px border-b-2 border-indigo-500"

  return (
    <>
      {LICENSE_NAV.map(({ text, href }, index) => (
        <Link key={href} href={href}>
          <a className={router.pathname == href ? active : normal}>
            <span className={ router.pathname == href ? spanActive : spanNormal }>
              {text}
            </span>
          </a>
        </Link>
      ))}
    </>
  )
}

function ProjectNav() {
  const router = useRouter()
  const { pid } = router.query
  const active = "px-3 text-green-600"
  const normal = "px-3 text-gray-600s hover:text-green-600"
  const spanNormal = "block py-3 -mb-px border-b-2 border-transparent"
  const spanActive = "block py-3 -mb-px border-b-2 border-green-500"

  const links = [
    {text: MENU.PROJECT_HOME, href: `/projects/${pid}`},
    {text: MENU.PROJECT_PERSONA, href: `/projects/${pid}/persona`},
    {text: MENU.PROJECT_SETTINGS, href: `/projects/${pid}/settings`},
  ]

  return (
    <>
      {links.map(({ text, href }, index) => (
        <Link key={href} href={href}>
          <a className={router.asPath.endsWith(href) ? active : normal}>
            <span className={ router.asPath == href ? spanActive : spanNormal }>
              {text}
            </span>
          </a>
        </Link>
      ))}
    </>
  )
}