import { connect } from '@lib/database'
import { DB } from '@lib/constants/db'

export const getLicense = async (apiUser, query, res) => {
  try {
    const { db } = await connect()
    const cursor = await db.collection(DB.Licenses).aggregate([
      { $match: { code: apiUser.license }},
      { $lookup: { from: 'users', localField: 'code', foreignField: 'license', as: 'users' }},
      { $lookup: { from: 'projects', localField: 'code', foreignField: 'license', as: 'projects' }},
      { $lookup: { from: 'clients', localField: 'code', foreignField: 'license', as: 'clients' }},
      // {$unwind: '$users'},
      { $project: {
        _id: 1, code: 1, type: 1,
        licenseName: 1, contactName: 1, contactUsername: 1, contactEmail: 1,
        publishedBy: 1, publishDate: 1, refreshDate: 1, expiryDate: 1,
        disabled: 1, createdAt: 1, updatedAt: 1, logoUrl: 1,

        'users': {$size: '$users'},
        'projects': {$size: '$projects'},
        'clients': {$size: '$clients'},
      }}
    ])

    const rs = await cursor.next()
    // console.log('rs.next()', rs)

    if (rs) {
      return res.json( rs )
    } else {
      return res.status(404).json({ 'message': 'License not found' })
    }
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}

export const updateLogo = async (apiUser, quey, body, res) => {
  try {
    const { db } = await connect()
    const rs = await db.collection(DB.Licenses).findOneAndUpdate(
      { code: apiUser.license },
      { $set: {
        logoUrl: body.imageUrl
      }}
    )

    // console.log('updateLogo', rs)

    return res.json({ message: 'Logo saved' })
  } catch (error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}