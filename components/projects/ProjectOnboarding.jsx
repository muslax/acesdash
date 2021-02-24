import Link from "next/link"
import { useEffect } from "react"
import { SVGProject } from "../SVGIcon"

export default function ProjectOnboarding() {
  useEffect(() => {
    const el = document.getElementById('onboarding')
    const top = el.offsetTop
    el.style.minHeight = `calc(100vh - ${top}px)`
  }, [])

  return (
    <div id="onboarding" className="aces-wrap -mb-24 bg-gray-50 bg-gradient-to-t from-white">
      <div className="aces-geist pt-1">
        <div className="mt-12 sm:mt-16 flex flex-col justify-center text-center border-bs">
          <div className="text-3xl sm:text-4xl text-purple-500 font-semibold mb-2">
            Belum ada proyek yang dibuat.
          </div>
          <div className="text-lg sm:text-xl text-gray-600 font-medium mb-6">
            Tekan tombol di bawah ini untuk membuat proyek.
          </div>
          <div className="relative flex flex-col sm:flex-row justify-center p-4">
            <div className="flex justify-center sm:block my-2">
              <div className="text-purple-500 hover:text-green-600">
                <div className="rounded-lg bg-green-200 bg-opacity-25 font-semibold hover:-m-1 hover:p-1">
                  <Link href="/projects/new">
                    <a
                      className="inline-flex items-center bg-white justify-center font-semibold focus:outline-none rounded-md border border-gray-300 hover:border-green-400 shadow-sm hover:shadow"
                    >
                      <div className="flex justify-center items-center w-48 py-3">
                        <SVGProject className="w-8 h-8 mr-3" />
                        <span className="">New Project</span>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}