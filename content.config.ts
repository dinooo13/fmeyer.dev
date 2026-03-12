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
        upcoming: z.object({
          title: z.string(),
          event: z.string(),
          date: z.string(),
          location: z.string(),
          topic: z.string(),
          description: z.string()
        }).optional(),
        invite: createBaseSchema().extend({
          link: createButtonSchema().optional()
        }).optional()
      })
    })
  }
})
