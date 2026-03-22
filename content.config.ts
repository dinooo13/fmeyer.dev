import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createBaseSchema = () => z.object({
  title: z.string(),
  description: z.string()
})

const createSeoSchema = () => z.object({
  title: z.string(),
  description: z.string()
})

const createButtonSchema = () => z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  target: z.enum(['_blank', '_self']).optional()
})

const createTalkResourceSchema = () => z.object({
  kind: z.enum(['slides', 'recording', 'handout', 'link']),
  title: z.string().nonempty(),
  asset: z.string().nonempty().optional(),
  url: z.string().url().optional(),
  format: z.string().optional(),
  pages: z.number().int().positive().optional(),
  description: z.string().optional()
}).superRefine((resource, ctx) => {
  const sources = Number(Boolean(resource.asset)) + Number(Boolean(resource.url))

  if (sources === 1) {
    return
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'Exactly one of "asset" or "url" is required for each talk resource.'
  })
})

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: createBaseSchema().extend({
        seo: createSeoSchema(),
        hero: z.object({
          name: z.string(),
          role: z.string(),
          intro: z.string()
        }),
        focus: createBaseSchema().extend({
          items: z.array(z.object({
            title: z.string(),
            description: z.string()
          }))
        }),
        experience: createBaseSchema().extend({
          items: z.array(z.object({
            period: z.string(),
            title: z.string(),
            organization: z.string(),
            url: z.string().optional(),
            summary: z.string(),
            highlights: z.array(z.string()),
            placeholder: z.boolean().optional()
          }))
        }),
        labs: createBaseSchema().extend({
          link: createButtonSchema()
        }),
        speaking: createBaseSchema().extend({
          note: z.string().optional(),
          link: createButtonSchema()
        })
      })
    }),
    labs: defineCollection({
      type: 'data',
      source: 'labs/*.yml',
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        image: z.string().nonempty().editor({ input: 'media' }),
        icon: z.string().optional(),
        status: z.enum(['wip', 'prototype', 'paused']),
        url: z.string().optional(),
        repoUrl: z.string().optional(),
        tags: z.array(z.string()),
        date: z.date(),
        note: z.string().optional()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: [{ include: 'labs.yml' }],
      schema: createBaseSchema().extend({
        seo: createSeoSchema().optional(),
        links: z.array(createButtonSchema()).optional()
      })
    }),
    speaking: defineCollection({
      type: 'page',
      source: 'speaking.yml',
      schema: createBaseSchema().extend({
        seo: createSeoSchema().optional(),
        links: z.array(createButtonSchema()).optional(),
        invite: createBaseSchema().extend({
          link: createButtonSchema().optional()
        }).optional()
      })
    }),
    talks: defineCollection({
      type: 'data',
      source: 'speaking/*.yml',
      schema: z.object({
        title: z.string().nonempty(),
        summary: z.string().nonempty(),
        description: z.string().nonempty(),
        event: z.string().nonempty(),
        organizerTitle: z.string().optional(),
        location: z.string().nonempty(),
        topic: z.string().nonempty(),
        date: z.date().optional(),
        dateLabel: z.string().nonempty(),
        time: z.string().optional(),
        room: z.string().optional(),
        duration: z.string().optional(),
        format: z.string().optional(),
        level: z.string().optional(),
        language: z.string().optional(),
        venueName: z.string().optional(),
        venueAddress: z.string().optional(),
        url: z.string().url().optional(),
        eventUrl: z.string().url().optional(),
        resources: z.array(createTalkResourceSchema()).optional(),
        placeholder: z.boolean().optional()
      })
    })
  }
})
