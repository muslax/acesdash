import useUser from '@lib/hooks/useUser'

function useIsLoading() {
  const { isLoading } = useUser()

  return isLoading
}

export function WithSkeletonLoader({
  children,
  skeletonLoader,
}) {
  const isLoading = useIsLoading()

  if (isLoading && skeletonLoader) {
    return <>{skeletonLoader}</>
  }

  return <>{children}</>
}