import { useEffect } from 'react'
import { NO_PAGE_FLICKER_CLASSNAME, NoPageFlicker } from './NoPageFlicker'
import { AUTH } from "@lib/constants"

const hasAuthCookie = () => {
  return document.cookie?.indexOf(AUTH.CookieName) !== -1
}

const handleAuthRedirect = ({
  redirectAuthenticatedTo,
  redirectUnAuthenticatedTo,
}) => {
  if (typeof window === 'undefined') return

  if (hasAuthCookie()) {
    console.log('hasAuthCookie')
    if (redirectAuthenticatedTo) {
      window.location.replace(redirectAuthenticatedTo)
    }
  } else {
    console.log('NOT hasAuthCookie')
    if (redirectUnAuthenticatedTo) {
      console.log('redirectUnAuthenticatedTo', redirectUnAuthenticatedTo)
      const url = new URL(redirectUnAuthenticatedTo, window.location.href)
      // url.searchParams.append('next', window.location.pathname)
      window.location.replace(url.toString())
    }
  }
}

export function WithAuthRedirect({
  children,
  ...props
}) {
  handleAuthRedirect(props)

  const noPageFlicker =
    props.suppressFirstRenderFlicker ||
    props.redirectUnAuthenticatedTo ||
    props.redirectAuthenticatedTo;

  useEffect(() => {
    document.documentElement.classList.add(NO_PAGE_FLICKER_CLASSNAME)
  }, [])

  return (
    <>
      {noPageFlicker && <NoPageFlicker />}
      {children}
    </>
  )
}