import fetchJson from "@lib/fetchJson"
import useSWR from "swr"


function parseFieldParams(fields) {
  if (typeof fields === 'string' && fields) {
    return `&field=${fields}`
  } else if (Array.isArray(fields)) {
    let query = ''
    fields.forEach(f => query += `&field=${f}`)

    return query
  }

  return ''
}

export function useModulesMeta(fields = '', method = false) {
  let query = parseFieldParams(fields)
  if (method) {
    query += `&method=${method}`
  }
  const { data, error } = useSWR(`/api/get?q=get-modules-meta${query}`, fetchJson)

  return {
    meta: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useProjectModules(pid, simple) {
  const base = `/api/get?q=get-project-modules&pid=${pid}`
  const url = simple !== undefined ? base : base + `&simple`
  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    modules: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useProjectGroups(pid, fields = '') {
  const query = parseFieldParams(fields)
  const url = `/api/get?q=get-groups&pid=${pid}` + query

  const { data, error, mutate } = useSWR(url, fetchJson)

  return {
    groups: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}