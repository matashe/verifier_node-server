import * as v from 'valibot'

export const createTemplateSchema = v.object({
  data: v.object({
    name: v.pipe(v.string('Name must be a string'), v.minLength(1)),
  }),
})
