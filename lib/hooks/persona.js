import fetchJson from "@lib/fetchJson"
import useSWR from "swr"

export function usePersonae(pid) {
  const url = `/api/get?q=get-personae&pid=${pid}`
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    personae: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function usePersona(id) {
  const url = `/api/get?q=get-persona&id=${id}`
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    persona: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

// get-personae-with-schedules
export function usePersonaeWithShedules(pid) {
  const url = `/api/get?q=get-personae-with-schedules&pid=${pid}`
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    personae: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}