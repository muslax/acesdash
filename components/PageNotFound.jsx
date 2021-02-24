import { useEffect } from "react"

export default function PageNotFound() {
  useEffect(() => {
    const elm = document.getElementById('not-found')
    const top = elm.offsetTop
    elm.style.height = `calc(100vh - ${top}px)`
  }, [])

  return (
    <div id="not-found" className="bg-pink-50 bg-gradient-to-t from-white -mb-24">
      <div className="aces-wrap bg-white pt-12 pb-16 border-b border-pink-100">
        <div className="aces-geist text-center">
          <div className="text-xl text-pink-500 mb-2">
            Maaf, server ada tidak dapat menemukan.
          </div>
          <div className="text-xss font-mono">
            <span className="bg-pink-400 text-white rounded-full inline-block px-3 py-1">
              {window.location.href}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}