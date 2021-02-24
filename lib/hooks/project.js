import fetchJson from "@lib/fetchJson"
import useSWR, { mutate } from "swr"

export function useProject(pid = undefined) {
  const base = `/api/get?q=get-project`
  const url = pid ? base + `&pid=${pid}` : base
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useProjectSimpleInfo(pid) {
  const url = `/api/get?q=get-project&pid=${pid}&simpleInfo=1`
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    projectSimpleInfo: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useProjects() {
  const url = `/api/get?q=get-projects`
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    projects: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}