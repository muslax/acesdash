import fetchJson from "@lib/fetchJson"
import useSWR from "swr"

export function useGuests(pid) {
  const url = '/api/get?q=get-guests&pid=' + pid
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    guests: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}