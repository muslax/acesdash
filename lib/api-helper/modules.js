import { DB } from "@lib/constants"
import { connect } from "@lib/database"
import { ObjectID } from "mongodb"

export const getModulesMeta = async (apiUser, query, res) => {
  const { db } = await connect()
  const { field, method } = query

  const params = {}

  if (field) {
    if (typeof field === 'string') {
      params[field] = 1
    } else if (Array.isArray(field)) {
      field.forEach(f => {
        params[f] = 1
      })
    }
  }

  const match = method ? { method: method } : {}

  try {
    if (field || method) {
      console.log('field | method')
      const rs = await db.collection(DB.ModulesMeta).find(
        match,
        { projection: params }
      ).toArray()

      return res.json(rs)
    } else {
      const rs = await db.collection(DB.ModulesMeta).find({}).toArray()

      return res.json( rs )
    }
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

// Return modules used by (all groups in a) project
export const getProjectModules = async (apiUser, query, res) =>  {
  try {
    const { db } = await connect()
    const { pid, simple } = query

    const rs = await db.collection(DB.ProjectGroups).find(
      { projectId: pid },
      { grupName: 0, modules: 1 }
    ).toArray()

    let array = []
    let metaIds = []

    rs.forEach(row => {
      row.modules.forEach(module => {
        if (!metaIds.includes(module.metaId)) {
          metaIds.push(module.metaId)
          if (simple !== undefined) {
            array.push({
              metaId: module.metaId,
              moduleName: module.moduleName
            })
          } else {
            array.push(module)
          }
        }
      })
    })

    return res.json(array)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const getProjectGroups = async (apiUser, query, res) => {
  try {
    const { db } = await connect()
    const { pid, field } = query

    if (!field) {
      const rs = await db.collection(DB.ProjectGroups).find({ projectId: pid }).toArray()

      return res.json( rs )
    } else {
      let params = {}
      if (typeof field === 'string') {
        params[field] = 1
      } else if (Array.isArray(field)) {
        field.forEach(f => {
          if (f == 'modulesCount') params[f] = { $size: '$modules' }
          else params[f] = 1
        })
      }

      const rs = await db.collection(DB.ProjectGroups).find(
        { projectId: pid },
        { projection: params }
      ).toArray()

      return res.json( rs )
    }

  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

// -------

export const createProjectGroup = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    let doc = body
    doc._id = ObjectID().toString()
    // doc.username = body.email
    doc.createdBy = apiUser.username
    doc.createdAt = new Date()

    const rs = await db.collection(DB.ProjectGroups).insertOne(doc)
    console.log('-------------------------')
    if (rs && rs['ops']) {
      console.log("rs['ops'][0]", rs['ops'][0])
      return res.json({ message: 'OK' })
    } else {
      throw new Error('Failed to save modules');
    }
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const updateProjectGroup = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    let doc = body
    console.log('BODY', body)
    doc.updatedAt = new Date()

    const rs = await db.collection(DB.ProjectGroups).findOneAndUpdate(
      { _id: body._id },
      { $set: { modules: body.modules }}
    )
    console.log(rs)
    if (rs) {
      // console.log(rs)
      return res.json({ message: 'OK' })
    } else {
      throw new Error('Failed to save modules');
    }
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const updateGroupAndPersonae = async (apiUser, query, body, res) => {
  // try {
    // let doc = body
    // doc.updatedAt = new Date()
  console.log('BODY', body)

  // Prepare for personae update
  const tests = []
  const sims = []
  body.modules.forEach(module => {
    if (module.method == 'selftest') tests.push(module.metaId)
    if (module.method == 'guided') sims.push(module.metaId)
  })

  const { db, client } = await connect()
  const session = client.startSession()

  try {
    console.log('Start transaction', new Date().toString())
    await session.withTransaction(async () => {
      const dbPersonae = db.collection(DB.Personae)
      const dbGroups = db.collection(DB.ProjectGroups)

      console.log('Upating personae', new Date().toString())
      await dbPersonae.updateMany(
        { projectId: body.projectId },
        {
          $set: { tests: tests, sims: sims },
          $currentDate: { lastModified: true }
        },
      )

      console.log('Upating group', new Date().toString())
      await dbGroups.findOneAndUpdate(
        { _id: body._id },
        {
          $set: { modules: body.modules, updatedAt: new Date() },
          $currentDate: { lastModified: true }
        }
      )
    })

    console.log('Returning response', new Date().toString())
    return res.json({ message: 'OK' })
  }
  catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
  finally {
    await session.endSession();
    // await client.close();
  }
}

// Start transaction  Wed Feb 24 2021 02:04:08 GMT+0700 (Western Indonesia Time)
// Upating personae   Wed Feb 24 2021 02:04:08 GMT+0700 (Western Indonesia Time)
// Upating group      Wed Feb 24 2021 02:04:08 GMT+0700 (Western Indonesia Time)
// Returning response Wed Feb 24 2021 02:04:08 GMT+0700 (Western Indonesia Time)