import { DB } from "@lib/constants"
import { connect } from "@lib/database"
import { ClientModel, ProjectModel } from "@lib/models"
import { ObjectID } from "mongodb"

function buildProjectParams(apiUser, pid, info = false) {
  console.log('Info:', info)
  const args = []
  if (pid) {
    args.push({ $match: { _id: pid } })
  } else {
    args.push(
      { $match: { license: apiUser.license } },
      { $sort: { _id: -1 } }
    )
  }

  if (info) {
    args.push(
      {$limit: 1},
      {$lookup: {
        from: DB.Clients, localField: 'clientId', foreignField: '_id', as: 'client',
      }},
      {$unwind: '$client'},
      {$project: {
        title: 1,
        shortTitle: 1,
        admin: 1,
        'client.name': 1,
      }}
    )
  } else {
    args.push(
      {$limit: 1},
      {$lookup: {
        from: DB.Clients, localField: 'clientId', foreignField: '_id', as: 'client',
      }},
      {$lookup: {
        from: DB.Users, localField: 'admin', foreignField: 'username', as: 'adminInfo',
      }},
      {$lookup: {
        from: DB.ProjectGroups, localField: '_id', foreignField: 'projectId', as: 'groups',
      }},
      {$lookup: {
        from: DB.Personae, localField: '_id', foreignField: 'projectId', as: 'persona',
      }},
      {$unwind: '$client'},
      // {$unwind: '$adminInfo'},
      {$project: {
        license: 1,
        title: 1,
        shortTitle: 1,
        description: 1,
        contacts: 1,
        accessCode: 1,
        startDate: 1,
        admin: 1,
        endDate: 1,
        openingDate: 1,
        closingDate: 1,
        createdAt: 1,
        createdBy: 1,
        'groups._id': 1,
        'groups.groupName': 1,
        'groups.modules.metaId': 1,
        'groups.modules.moduleName': 1,
        'client._id': 1,
        'client.name': 1,
        'client.city': 1,
        'adminInfo.fullname': 1,
        'adminInfo.username': 1,
        totalPersonae: {$size: '$persona'},
      }}
    )
  }

  return args
}

/**
 * When pid query is not supplied, get the latest
 * @param {*} apiUser
 * @param {*} query
 * @param {*} res
 */
export const getProject = async (apiUser, query, res) => {
  try {
    const { db } = await connect()
    const { pid, simpleInfo } = query
    const info = simpleInfo !== undefined
    console.log('Info:', info)
    const params = buildProjectParams(apiUser, pid, info)
    const cursor = await db.collection(DB.Projects).aggregate(params)

    const rs = await cursor.next()

    if (rs) {
      // Simple info
      if (info) return res.json(rs)

      // Rebuild
      // adminInfo comes as array, since the lookup didn't use _id
      const project = rs
      if (rs.adminInfo.length > 0) {
        project.adminInfo = rs.adminInfo[0]
      } else {
        project.adminInfo = null
      }
      return res.json(project)
    } else {
      return res.status(404).json({ message: 'Not Found' })
    }
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const getProjects = async (apiUser, query, res) => {
  try {
    const { db } = await connect()
    const rs = await db.collection(DB.Projects).aggregate([
      {$match: {license: apiUser.license}},
      {$sort: {_id: -1}},
      {$lookup: {
        from: DB.Clients, localField: 'clientId', foreignField: '_id', as: 'client',
      }},
      {$lookup: {
        from: DB.Users, localField: 'admin', foreignField: 'username', as: 'adminInfo',
      }},
      // {$lookup: {
      //   from: DB.ProjectGroups, localField: '_id', foreignField: 'projectId', as: 'groups',
      // }},
      {$lookup: {
        from: DB.Personae, localField: '_id', foreignField: 'projectId', as: 'persona',
      }},
      {$unwind: '$client'},
      // commented to prevent zero rs when project admin deleted
      // {$unwind: '$admin'},
      {$project: {
        title: 1,
        shortTitle: 1,
        description: 1,
        contacts: 1,
        accessCode: 1,
        startDate: 1,
        endDate: 1,
        openingDate: 1,
        closingDate: 1,
        createdAt: 1,
        // createdBy: 1,
        // 'groups.modules.metaId': 1,
        // 'groups.modules.moduleName': 1,
        'client._id': 1,
        'client.name': 1,
        'client.city': 1,
        'adminInfo.fullname': 1,
        'adminInfo.username': 1,
        totalPersonae: {$size: '$persona'},
      }}
    ]).toArray()

    return res.json(rs)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const createProject = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    let project = ProjectModel
    let client = null

    // Check if it is for new client
    if ( !body.clientId ) {
      client = ClientModel
      client._id        = ObjectID().toString()
      client.license    = apiUser.license
      client.name       = body.clientName
      client.address    = body.clientAddress
      client.city       = body.clientCity
      client.phone      = body.clientPhone
      client.contacts   = []
      client.createdBy  = apiUser.username
      client.createdAt  = new Date()
      client.updatedAt  = null

      const rs = await db.collection(DB.Clients).insertOne(client)

      if (rs['ops'] && rs['ops'][0]) {
        console.log('New Client', rs['ops'][0])
        project.clientId = client._id
      }
    }

    project._id =         ObjectID().toString()
    project.license =     apiUser.license
    project.clientId =    body.clientId ? body.clientId : client._id
    project.status =      null
    project.title =       body.title
    project.shortTitle =  body.shortTitle
    project.description = body.description
    project.startDate =   body.startDate
    project.endDate =     body.endDate
    project.admin =       apiUser.username
    project.contacts =    []
    // project.groups =      [ 1 ]
    project.accessCode =  null
    project.openingDate =  null
    project.closingDate = null
    project.createdBy =   apiUser.username
    project.createdAt =   new Date()
    project.updatedAt =   null

    const rs = await db.collection(DB.Projects).insertOne(project)

    if (rs['ops'] && rs['ops'][0]) {
      // Send the whole object to be used as ref for modules selection
      let resProject = rs['ops'][0]
      resProject.clientName = body.clientName
      console.log('resProject', resProject)
      return res.json( resProject )
    } else {
      throw new Error('Failed to create new user');
    }
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const setDeployment = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    const rs = await db.collection(DB.Projects).findOneAndUpdate(
      { _id: body.projectId },
      {
        $set: {
          openingDate: new Date(body.openingDate),
          closingDate: new Date(body.closingDate),
          accessCode: body.accessCode,
          updatedAt: new Date(),
        },
        $currentDate: { lastModified: true }
      }
    )

    console.log('findOneAndUpdate', rs)
    return res.json({ message: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const updateProject = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    const rs = await db.collection(DB.Projects).findOneAndUpdate(
      { _id: body._id },
      {
        $set: {
          title: body.title,
          shortTitle: body.shortTitle,
          description: body.description,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
        },
        $currentDate: { lastModified: true }
      }
    )

    console.log('findOneAndUpdate', rs)
    return res.json({ message: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}