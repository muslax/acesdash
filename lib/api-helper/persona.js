import { DB } from "@lib/constants"
import { connect } from "@lib/database"
import { createPassword } from "@lib/utils"
import { ObjectID } from "mongodb"


function buildUpdateParam (body) {
  if (!body.id) return false

  let param = body.packet
  param.updatedAt = new Date()

  return param
}

export const checkAndPrepareCSV = async (apiUser, query, body, res) => {
  let rows = body
  for (let i = 0; i < rows.length; i++) {
    const { password, hashed_password, xfpwd } = createPassword(rows[i].username)
    rows[i]._id = ObjectID().toString()
    rows[i].hashed_password = hashed_password
    rows[i].xfpwd = xfpwd
  }

  console.log(new Date(), 'Finished checking')
  return res.json(rows)
}

export const getPersonae = async (apiUser, query, res) => {
  try {
    const { db } = await connect()
    const { pid } = query
    const rs = await db.collection(DB.Personae).find(
      { license: apiUser.license, projectId: pid },
      { projection: {
        _id: 1,
        fullname: 1,
        group: 1,
        _tests: {$size: '$tests'},
        _sims: {$size: '$sims'},
        _testsPerformed: {$size: '$testsPerformed'},
        _simsPerformed: {$size: '$simsPerformed'},
      }}
    ).toArray()

    return res.json(rs)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const getPersona = async (apiUser, query, res) => {
  try {
    const { db } = await connect()
    const { id } = query
    const rs = await db.collection(DB.Personae).findOne(
      { _id: id },
      { projection: {
        // _id: 1,
        createdBy: 0,
        createdAt: 0,
        updatedAt: 0,
        hashed_password: 0,
        xfpwd: 0,
      }}
    )

    if (rs) {
      return res.json(rs)
    } else {
      return res.status(404).json({ message: 'Not Found' })
    }
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

// 'update-persona': updatePersona,
export const updatePersona = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    const updateParam = buildUpdateParam(body)
    const rs = await db.collection(DB.Personae).findOneAndUpdate(
      { _id: body.id },
      { $set: updateParam }
    )

    console.log('RS', rs)
    return res.json({ message: `Document ${body.id} updated` })
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

// 'delete-persona': updatePersona,
export const deletePersona = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    const rs = await db.collection(DB.Personae).findOneAndDelete(
      { _id: body.id }
    )

    console.log('RS', rs)
    return res.json({ message: `Document ${body.id} deleted` })
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export const createPersona = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    let model = body
    const { password, hashed_password, xfpwd } = createPassword(model.username)
    model._id = ObjectID().toString()
    model.license = apiUser.license
    model.createdBy = apiUser.username
    model.createdAt = new Date()
    model.hashed_password = hashed_password
    model.xfpwd = xfpwd

    // console.log(model)
    // return res.json({ message: 'OK' })

    const rs = await db.collection(DB.Personae).insertOne(model)

    if (rs['ops'] && rs['ops'][0]) {
      // Just send notification
      const person = rs['ops'][0]
      console.log('person', person)
      return res.json({
        person: {
          type: 'persona',
          _id: person._id,
          fullname: person.fullname,
          username: person.username,
          email: person.email,
          password: password
        }
      })
    } else {
      throw new Error('Failed to create new user');
    }
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const saveCSVData = async (apiUser, query, body, res) => {
  console.log(new Date(), 'lib/saveCSVData')
  const { license, projectId, group, tests, personae } = body
  let docs = []
  console.log(new Date(), 'Compiling csv data...')
  for (let i = 0; i < personae.length; i++) {
    let person = personae[i]
    // const { password, hashed_password, xfpwd } = createPassword(person.username)
    person._id = ObjectID().toString()
    docs.push(person)
    console.log(person._id)
  }
  console.log(new Date(), 'Finished compiling csv data')

  try {
    const { db } = await connect()
    console.log(new Date(), 'BEFORE insertMany(docs)...')
    await db.collection(DB.Personae).insertMany(docs)
    console.log(new Date(), 'AFTER insertMany(docs)...')
    // console.log('insertedCount', rs.insertedCount)
    // console.log('insertedIds', rs.insertedIds)

    // optimistic
    return res.json({
      created: 'CSV IMPORTED'
    })
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const getPersonaeWithSchedules = async (apiUser, query, res) => {
  console.log('getPersonaeWithSchedules')
  try {
    const { db } = await connect()
    const { pid } = query
    console.log('pid', pid)
    const rs = await db.collection(DB.Personae).find(
      { projectId: pid, sims: { $exists: true, $ne: [] }},
      { projection: {_id: 1, username:1, fullname: 1, group: 1, sims: 1}}
    ).toArray()

    // console.log(rs)

    return res.json(rs)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}