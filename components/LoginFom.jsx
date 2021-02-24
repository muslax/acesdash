import fetchJson from "@lib/fetchJson";
import useUser from "@lib/hooks/useUser";
import { useState } from "react";

export function LoginFom({ onSuccess }) {
  const { mutateUser } = useUser()

  const [errorMessage, setErrorMessage] = useState(undefined)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    }

    try {
      await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(body),
        })
      )

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMessage(error.data.message)
    }

    setSubmitting(false)
  }

  const inputBase = "w-full px-3 py-2 rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  const btnBase = "bg-indigo-300 w-full py-2 font-medium text-indigo-600 rounded border border-transparent hover:shadow focus:outline-none focus:border-indigo-400 focus:ring focus:ring-purple-200 focus:ring-opacity-75 active:text-white active:bg-indigo-400"

  return (
    <form
      onSubmit={handleSubmit}
      className="w-72"
    >
      <p className="mb-5 text-lg leading-snugs font-light">
        <span className="font-semibold mr-2">Selamat datang.</span>
        Masukkan username dan password Anda.
      </p>

      <div className="mb-4">
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          required
          autoFocus
          autoComplete="off"
          className={inputBase}
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          required
          className={inputBase}
        />
      </div>
      {errorMessage && !submitting && (
        <div className="text-sm my-3">
          <p
            className={"text-pink-500"}>
            {errorMessage}
          </p>
        </div>
      )}
      {submitting && (
        <div className="text-sm mt-4">
          <p
            className="h-1 rounded-full"
            style={{"backgroundImage": "url(/mango-in-progress-01.gif)"}}
          ></p>
        </div>
      )}
      <div className="flex items-center justify-between mt-6 mb-4">
        <button className={btnBase} type="submit">
          Sign In
        </button>
      </div>

    </form>
  )
}