import * as v from 'valibot'

export const createSessionSchema = v.object({
  data: v.object({
    email: v.pipe(v.string('Email must be a string'), v.email('Invalid email')),
    password: v.pipe(v.string('Password must be a string'), v.minLength(8)),
  }),
})

export const refreshSessionSchema = v.object({
  data: v.object({
    refreshToken: v.string(),
  }),
})
