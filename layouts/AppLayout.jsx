import { useEffect } from "react";
import { AppHeader } from "./AppHeader";

export function AppLayout({ children, isLoading, bgColor }) {
  const bgColor_ = bgColor ? bgColor : 'bg-gray-50'

  useEffect(() => {
    const el = document.getElementById('app-layout')
    const h = el.offsetTop
    el.style.minHeight = `calc(100vh - ${h}px)`
  }, [])

  return (
    <>
      <AppHeader isLoading={isLoading} />

      <div id="app-layout" className={`${bgColor_} h-auto min-h-screen overflow-auto pb-24`}>
        {children}
      </div>
      <footer id="app-footer" className="bg-gray-50 border-ts border-gray-200">
        <div className="bg-gray-300s bg-opacity-25 pt-4 pb-16">
          <div className="aces-geist text-gray-400 text-xs text-center">
            ALSO
          </div>
        </div>
      </footer>
    </>
  )
}