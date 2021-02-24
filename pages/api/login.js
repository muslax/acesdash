import withSession from '@lib/session'
import { connect } from '@lib/database'

const bcrypt = require('bcryptjs')

export default withSession(async (req, res) => {
  const { username, password } = await req.body

  try {
    const { db } = await connect()
    const cursor = await db.collection("users").aggregate([
      { $match: { username: username}},
      { $lookup: {
        from: 'licenses',
        localField: 'license',
        foreignField: 'code',
        as: 'licenseInfo',
      }},
      { $unwind: '$licenseInfo'},
      { $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        email: 1,
        license: 1,
        licenseOwner: 1,
        hashed_password: 1,
        roles: 1,
        'licenseInfo.licenseName': 1,
        'licenseInfo.logoUrl': 1,
      }},
    ])

    const rs = await cursor.next()

    if (rs) {
      const verified = bcrypt.compareSync(password, rs.hashed_password)
      if (verified) {
        const user = {
          isLoggedIn: true,
          _id: rs._id,
          username: rs.username,
          fullname: rs.fullname,
          email: rs.email,
          roles: rs.roles,
          license: rs.license,
          licenseOwner: rs.licenseOwner,
          licenseName: rs.licenseInfo.licenseName, // licenseInfo is array
          licenseLogo: rs.licenseInfo.logoUrl,
        }

        req.session.set("user", user)
        await req.session.save()
        res.json(user)
      } else {
        res.status(404)
        res.json({ message: "[1] Username/password salah." })
      }
    }
    else {
      res.status(404)
      res.json({ message: "[2] Username/password salah." })
    }
  } catch (error) {
    res.status(404)
    res.json({ message: "[3] Username/password salah." })
  }
})