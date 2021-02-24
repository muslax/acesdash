import { MENU, ROUTES } from "@lib/constants";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LicenseSidebar() {
  const router = useRouter()

  const links = [
    {text: MENU.LICENSE_INFO, href: ROUTES.Info},
    {text: MENU.LICENSE_USERS, href: ROUTES.Users},
    {text: MENU.LICENSE_CLIENTS, href: ROUTES.Clients},
    {text: MENU.LICENSE_BILLING, href: ROUTES.Billing},
  ]

  const base = "font-semibold px-4 sm:px-0 py-6 sm:py-3 border-b "
  const normal = base + "hover:text-purple-500"
  const active = base + "text-purple-700 border-purple-300 hover:text-purple-500"

  return (
    <div className="text-sm text-gray-700">
      {router.route == "/license" && (
        <div className="bg-white text-xl leading-loose font-semibold">
          <p className="border-b -mx-4 px-4 pb-4 sm:hidden">
            Settings
          </p>
        </div>
      )}
      <div className="flex flex-col -mx-4 sm:mx-0 sm:w-36 leading-base">
        {links.map(({ text, href }) => (
          <Link key={href} href={href}>
            <a
              className={router.pathname.endsWith(href) ? active : normal}
            >
              {text}{router.pathname.endsWith(href) && <span className="text-gray-300">&nbsp; &rarr;</span>}
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}