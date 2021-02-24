import { ACESRed } from "@layouts/AcesLogo"
import { useLicense } from "@lib/hooks"
import useUser from "@lib/hooks/useUser"
import Link from "next/link"
import { useState } from "react"
import LogoUploader from "./LogoUploader"

function LicenseFieldSpan({str}) {
  const replace = str ? str : '-'
  return (
    <span className="inline-block rounded-sm bg-gray-100 border-l-4 border-gray-200 pl-2 pr-4 py-1">{replace}</span>
  )
}

export default function LicenseInfo() {
  const { user: currentUser } = useUser()
  const { license, isLoading, isError } = useLicense()

  const [view, setView] = useState(undefined)

  if (view === 'upload') return <LogoUploader setView={() => setView(undefined)} />

  return (
    <div className="max-w-xl text-sm rounded border border-purple-300 px-6 py-6">
      <div className="flex items-center text-2xl">
        <div className="flex flex-row border-r border-red-300 pr-4 mr-4">
          <ACESRed />
        </div>
        <span className="text-red-500">ACES Corporate License</span>
      </div>
      <hr className="my-5 border-purple-300" />
      <p className="text-gray-700 mb-6">
        {/* {lang.LICENSE_INFO_INTRO} */}Lorem ipsum
      </p>
      {isLoading && (
        <div className="p-6 text-center text-gray-400">Loading...</div>
      )}
      {isError && (
        <div className="p-6 text-center text-red-500">Error loading data.</div>
      )}
      {license && (
        <table className="w-full">
          <tbody>
            <tr className="">
              <td width="120" className="py-1">License ID:</td>
              <td className="py-1 pl-2"><LicenseFieldSpan str={license?._id}/></td>
            </tr>
            <tr className="">
              <td className="py-1">License code:</td>
              <td className="py-1 pl-2"><LicenseFieldSpan str={license?.code}/></td>
            </tr>
            <tr className="">
              <td className="py-1">License type:</td>
              <td className="py-1 pl-2"><LicenseFieldSpan str={license?.type?.toUpperCase()}/></td>
            </tr>
            <tr className="">
              <td className="py-1">License holder:</td>
              <td className="py-1 pl-2"><LicenseFieldSpan str={license?.licenseName}/></td>
            </tr>
            <tr className="">
              <td className="py-1">Admin/contact:</td>
              <td className="py-1 pl-2"><LicenseFieldSpan str={license?.contactName}/></td>
            </tr>
            <tr className="">
              <td className="py-1">Admin username:</td>
              <td className="py-1 pl-2"><LicenseFieldSpan str={license?.contactUsername}/></td>
            </tr>
            <tr className="">
              <td className="py-1">Admin email:</td>
              <td className="py-1 pl-2"><LicenseFieldSpan str={license?.contactEmail}/></td>
            </tr>
            <tr className="">
              <td className="py-1">Publish date:</td>
              <td className="py-1 pl-2"><LicenseFieldSpan str={license?.publishDate}/></td>
            </tr>
            <tr className="">
              <td className="py-1">Valid until:</td>
              <td className="py-1 pl-2"><LicenseFieldSpan str={license?.expiryDate}/></td>
            </tr>
            <tr><td colSpan="2" className="pt-5 pb-2"><hr className="border-purple-300" /></td></tr>
            <tr>
              <td colSpan="2" className="text-centers py-2">
                {currentUser.licenseOwner && (
                  <button
                    onClick={e => setView('upload')}
                    className="inline-flex text-sm rounded border border-gray-300 hover:bg-white hover:border-gray-400 focus:outline-none hover:shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-1"
                  >
                    Upload Logo
                  </button>
                )}
                {!currentUser.licenseOwner && (
                  <>
                    <button
                      disabled
                      className="inline-flex text-sm text-gray-400 rounded border border-gray-300 hover:bg-white px-3 py-1"
                    >
                      Upload Logo
                    </button>
                    <span className="text-xs text-gray-600 ml-3">
                      Upload logo hanya dapat dilakukan oleh{` `}
                      <span className="text-gray-700 font-medium">License Owner</span>.
                    </span>
                  </>
                )}
              </td>
            </tr>
            <tr><td colSpan="2" className="py-2"><hr className="border-purple-300" /></td></tr>
          </tbody>
        </table>
      )}
      <h3 className="font-bold mt-8">
        {/* {lang.LABEL_LICENSE_STATEMENT} */}
        License Statement
      </h3>

      <p className="text-xs mt-4 mb-12">
        {/* {lang.TEXT_LICENSE_STATEMENT} */}
        Lorem ipsums...
      </p>
    </div>
  )
}