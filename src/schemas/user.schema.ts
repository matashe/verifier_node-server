import * as v from 'valibot'

export const createUserSchema = v.object({
  data: v.object({
    email: v.pipe(v.string('Email must be a string'), v.email('Invalid email')),
    password: v.pipe(v.string('Password must be a string'), v.minLength(8)),
    passwordConfirmation: v.pipe(
      v.string('Password confirmation must be a string'),
      v.minLength(8)
    ),
  }),
})
