import BackToSettings from "@components/BackToSettings"
import LicenseSidebar from "./LicenseSidebar"

export default function LicenseLayout({ children, isIndex = false }) {
  if (isIndex) return (
    <div className="aces-wrap">
      <div className="aces-geist">
        <div className="flex flex-row">
          <div className="w-full sm:w-36 pt-5">
            <LicenseSidebar />
          </div>
          <div className="hidden sm:block flex-grow sm:pl-8 md:pl-10 pt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <div className="aces-wrap">
      <div className="aces-geist">
        <div className="flex flex-row">
          <div className="hidden sm:block sm:w-36 pt-5">
            <LicenseSidebar />
          </div>
          <div className="flex-grow">
            <BackToSettings text="Back to License" href="/license"/>
            <div className="sm:pl-8 md:pl-10 pt-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}