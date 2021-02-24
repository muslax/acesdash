import { useLicense } from "@lib/hooks";
import useUser from "@lib/hooks/useUser";
import Image from 'next/image'

export default function Hero() {
  const { user } = useUser()
  const { license, isLoading, isError } = useLicense()

  return (
    <div className="bg-gray-100s border-b border-gray-200 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="w-full grid grid-cols-7">
          <div className="col-span-7 md:col-span-5">
            <div className="flex flex-row items-center justify-center">
              <div className="tenant-logo flex-0 pr-4 -ml-12 md:ml-0">
                <div className="w-28 h-28 rounded-full bg-gray-200 shadow">
                  {(isError || isLoading) && <></>}
                  {/* {license && <img className="object-contain rounded-full w-28 h-28" src={license.logoUrl} />} */}
                  <Image
                    src={license?.logoUrl ?? user?.licenseLogo}
                    width={112}
                    height={112}
                    className="object-contain rounded-full w-28 h-28"
                  />
                </div>
              </div>
              <div className="tenant-copy flex-0 md:flex-grow">
                <div className="text-xs text-gray-600 leading-tight uppercase">
                  {(isError || isLoading) && <>Aces License Type</>}
                  {license && <>Aces {license.type} License</>}
                  {/* {user.licenseName} */}
                </div>
                <div className="license-name text-3xl text-gray-800 leading-snug tracking-tight">
                  {/* {(isError || isLoading) && <>...</>} */}
                  {/* {license && <>{license.licenseName}</>} */}
                  {user.licenseName}
                </div>
                <div className="text-gray-800">
                  {(isError || isLoading) && <>...</>}
                  {license && <>{license.publishDate.substr(0, 10)}</>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}