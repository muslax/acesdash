import fetchJson from "@lib/fetchJson"
import useSWR from "swr"

export function useClients() {
  const url = '/api/get?q=get-clients'
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    clients: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}