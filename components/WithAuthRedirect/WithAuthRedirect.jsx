import { useEffect } from 'react'
import { NO_PAGE_FLICKER_CLASSNAME, NoPageFlicker } from './NoPageFlicker'
import { AUTH } from "@lib/constants"
import useUser from '@lib/hooks/useUser'

const hasAuthCookie = () => {
  return document.cookie?.indexOf(AUTH.CookieName) !== -1
}

/*
const __handleAuthRedirect = ({
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

const _handleAuthRedirect = (user, {
  redirectAuthenticatedTo,
  redirectUnAuthenticatedTo,
}) => {
  if (typeof window === 'undefined') return

  if (user && user.isLoggedIn) {
    console.log('isLoggedIn: TRUE')
    if (redirectAuthenticatedTo) {
      window.location.replace(redirectAuthenticatedTo)
    }
  } else {
    console.log('isLoggedIn: FALSE')
    if (redirectUnAuthenticatedTo) {
      console.log('redirectUnAuthenticatedTo', redirectUnAuthenticatedTo)
      const url = new URL(redirectUnAuthenticatedTo, window.location.href)
      // url.searchParams.append('next', window.location.pathname)
      window.location.replace(url.toString())
    }
  }
}
*/
const handleAuthRedirect = (user, {
  redirectAuthenticatedTo,
  redirectUnAuthenticatedTo,
}) => {
  if (typeof window === 'undefined') return

  if (!user || user.isLoggedIn === false) {
    if (redirectUnAuthenticatedTo !== undefined) {
      console.log('redirectUnAuthenticatedTo !== undefined')
      const url = new URL(redirectUnAuthenticatedTo, window.location.href)
      window.location.replace(url.toString())
    }
  } else {
    if (redirectAuthenticatedTo !== undefined) {
      console.log('redirectAuthenticatedTo !== undefined')
      window.location.replace(redirectAuthenticatedTo)
    }
  }
}


export function WithAuthRedirect({
  children,
  ...props
}) {
  const { user, isLoading } = useUser()

  console.log('props.redirectAuthenticatedTo', (props.redirectAuthenticatedTo ? props.redirectAuthenticatedTo : '-'))
  console.log('props.redirectUnAuthenticatedTo', (props.redirectUnAuthenticatedTo ? props.redirectUnAuthenticatedTo : '-'))

  if (isLoading) return <></>

  // if (!user || user.isLoggedIn === false) {
  //   if (props.redirectUnAuthenticatedTo !== undefined) {
  //     console.log('props.redirectUnAuthenticatedTo !== undefined')
  //     const url = new URL(redirectUnAuthenticatedTo, window.location.href)
  //     window.location.replace(url.toString())
  //   }
  // } else {
  //   if (props.redirectAuthenticatedTo !== undefined) {
  //     console.log('props.redirectAuthenticatedTo !== undefined')
  //     window.location.replace(redirectAuthenticatedTo)
  //   }
  // }

  console.log(user && user.isLoggedIn ? `WithAuthRedirect: ${user.fullname}` : 'NO USER')

  handleAuthRedirect(user, props)

  const noPageFlicker =
    props.suppressFirstRenderFlicker ||
    props.redirectUnAuthenticatedTo ||
    props.redirectAuthenticatedTo;

  // useEffect(() => {
  //   document.documentElement.classList.add(NO_PAGE_FLICKER_CLASSNAME)
  // }, [])

  return (
    <>
      {/* {noPageFlicker && <NoPageFlicker />} */}
      {children}
    </>
  )
}