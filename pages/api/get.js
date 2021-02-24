import { getClients } from '@lib/api-helper/client'
import { getGuests } from '@lib/api-helper/guest'
import { getLicense } from '@lib/api-helper/license'
import { getModulesMeta, getProjectGroups, getProjectModules } from '@lib/api-helper/modules'
import { getPersona, getPersonae, getPersonaeWithSchedules } from '@lib/api-helper/persona'
import { getProject, getProjects } from '@lib/api-helper/project'
import { checkUsername, getUsers } from '@lib/api-helper/user'
import withSession from '@lib/session'

const ACCEPTED_QUERIES = {
  'get-license': getLicense,
  //
  'get-clients': getClients,
  //
  'get-projects': getProjects,
  'get-project': getProject,
  //
  'get-modules-meta': getModulesMeta,
  'get-project-modules': getProjectModules, // GANTI get-modules
  'get-groups': getProjectGroups,
  //
  'get-persona': getPersona,
  'get-personae': getPersonae,
  'get-personae-with-schedules': getPersonaeWithSchedules,
  //
  'get-users': getUsers,
  'check-username': checkUsername,
  //
  'get-guests': getGuests,
}

export default withSession(async (req, res) => {
  const apiUser = req.session.get('user')
  const { q } = req.query

  if (!apiUser || apiUser.isLoggedIn === false) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  console.log('q:', q)

  if (!q || !ACCEPTED_QUERIES[q]) {
    return res.status(400).json({ message: 'Bad Request' })
  }

  const task = ACCEPTED_QUERIES[q]

  return task (apiUser, req.query, res)
})