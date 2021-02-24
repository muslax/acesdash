import { createGuest, deleteGuest, disableGuest, resetGuestPassword } from "@lib/api-helper/guest"
import { updateLogo } from "@lib/api-helper/license"
import { createProjectGroup, updateGroupAndPersonae, updateProjectGroup } from "@lib/api-helper/modules"
import { checkAndPrepareCSV, createPersona, deletePersona, saveCSVData, updatePersona } from "@lib/api-helper/persona"
import { createProject, setDeployment, updateProject } from "@lib/api-helper/project"
import { createUser, deleteUser } from "@lib/api-helper/user"
import withSession from "@lib/session"

const ACCEPTED_QUERIES = {
  'create-user': createUser,
  'update-logo': updateLogo,
  'delete-user': deleteUser,

  'create-project': createProject,
  'update-project': updateProject,

  'create-project-group': createProjectGroup,
  'update-project-group': updateProjectGroup,
  'update-group-and-personae': updateGroupAndPersonae,
  'set-deployment': setDeployment,

  // 'create-project-guest': createProjectGuest,
  'create-persona': createPersona,
  'update-persona': updatePersona,
  'delete-persona': deletePersona,
  'save-csv-data': saveCSVData,
  'check-and-prepare-csv': checkAndPrepareCSV,

  'create-guest': createGuest,
  'delete-guest': deleteGuest,
  'disable-guest': disableGuest,
  'reset-guest-password': resetGuestPassword,
}

export default withSession(async (req, res) => {
  const apiUser = req.session.get('user')
  const { q } = req.query

  if (!apiUser || apiUser.isLoggedIn === false) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  // console.log('q:', q)
  console.log(new Date(), q)

  if (!q || !ACCEPTED_QUERIES[q]) {
    return res.status(400).json({ message: 'Bad Request' })
  }

  const task = ACCEPTED_QUERIES[q]

  return task (apiUser, req.query, req.body, res)
})