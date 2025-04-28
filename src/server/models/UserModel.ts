/**
 * The mongoose model for users.
 *
 * @module models/UserModel
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 */

import mongoose, { HydratedDocument } from 'mongoose'
import * as argon2 from 'argon2'
import BASE_SCHEMA from './baseSchema.js'

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  statics: {
    /**
     * Tries to log in a user.
     *
     * @param username - The username of the user.
     * @param password - The password of the user.
     * @returns Returns a promise that resolves to the user document if the credentials are correct, otherwise null.
     */
    async authenticate (username: string, password: string): Promise<HydratedDocument<any> | null> {
      const user = await this.findOne({ username })

      if (!user || !await argon2.verify(user.password, password)) {
        return null
      }

      return user
    }
  }
})

schema.add(BASE_SCHEMA)

schema.pre('save', async function (next: Function) {
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await argon2.hash(this.password)
  next()
})

const UserModel = mongoose.model('User', schema)
export default UserModel
