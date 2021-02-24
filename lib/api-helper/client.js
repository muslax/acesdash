import { DB } from "@lib/constants"
import { connect } from "@lib/database"

export const getClients = async (apiUser, query, res) => {
  try {
    const { db } = await connect()
    const rs = await db.collection(DB.Clients).find({ license: apiUser.license }).toArray()
    return res.json(rs)
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}