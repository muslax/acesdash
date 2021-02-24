import { ObjectID } from 'mongodb'
import { connect } from 'lib/database'
import { DB } from '@lib/constants'
import { createRandomPassword } from '@lib/utils'

export const createGuest = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    let doc = body
    doc._id = ObjectID().toString()
    doc.license = apiUser.license
    doc.createdBy = apiUser.username
    doc.createdAt = new Date()

    const rs = await db.collection(DB.ProjectGuests).insertOne(doc)

    if (rs && rs['ops']) {
      console.log("rs['ops'][0]", rs['ops'][0])
      return res.json({ message: 'OK', created: true })
    } else {
      throw new Error('Failed to save modules');
    }
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const getGuests = async (apiUser, query, res) => {
  try {
    const { db } = await connect()
    const { pid } = query

    const rs = await db.collection(DB.ProjectGuests).find({ projectId: pid }).toArray()
    return res.json(rs)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const deleteGuest = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    const rs = await db.collection(DB.ProjectGuests).findOneAndDelete(
      { _id: body.id }
    )

    console.log('RS', rs)
    return res.json({ message: `Document ${body.id} deleted` })
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export const disableGuest = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    const { enable } = query
    console.log('enable:', enable)
    const rs = await db.collection(DB.ProjectGuests).findOneAndUpdate(
      { _id: body.id },
      { $set: { disabled: !enable ? true : false }}
    )

    // console.log('RS', rs)
    return res.json({ message: `Document ${body.id} deleted` })
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

// Reset password
export const resetGuestPassword = async (apiUser, query, body, res) => {
  try {
    const { db } = await connect()
    const { password, hashed_password, xfpwd } = createRandomPassword()
    const rs = await db.collection(DB.ProjectGuests).findOneAndUpdate(
      { _id: body.id },
      { $set: {
        hashed_password: hashed_password,
        updatedAt: new Date(),
      }}
    )

    console.log('RS', rs)
    return res.json({ message: `Document ${body.id} deleted` })
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}