const { LoginFom } = require("@components/LoginFom")
const { WebLayout } = require("@layouts/WebLayout")
const { ROUTES } = require("@lib/constants")
const { useRouter } = require("next/router")

function useRedirectToAfterLogin() {
  const { next } = useRouter().query

  if (!next) {
    return undefined
  }

  return decodeURIComponent(next)
}

const LoginPage = () => {
  const router = useRouter()
  const redirectTo = useRedirectToAfterLogin()

  const handleSuccess = () => {
    router.push(redirectTo ?? ROUTES.Dashboard)
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50 bg-gradient-to-b from-gray-300">
      <div className="rounded-md shadow-sm bg-white bg-opacity-20 border-2 border-white border-opacity-80 p-5 mb-24">
        <LoginFom onSuccess={handleSuccess} />
        <div className="mt-8 text-sm">
          sam6875 sum5d5b grab2ef
        </div>
      </div>
    </div>
  )
}

LoginPage.getLayout = (page) => <WebLayout>{page}</WebLayout>
LoginPage.redirectAuthenticatedTo = ROUTES.Dashboard

export default LoginPage