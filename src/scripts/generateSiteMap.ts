import fs from 'fs'
import path from 'path'
import globby from 'globby'
import { Post } from '../utility/blog'

export default async function generateSiteMap(posts: Post[]) {
  const pagesDir = path.resolve(process.cwd(), 'src/pages')

  const pages = [
    // Ignore Next.js specific files (e.g., _app.tsx), API routes & posts
    ...(await globby([
      `${pagesDir}/**/*{.tsx,.mdx}`,
      `!${pagesDir}/posts/**/*.mdx`,
      `!${pagesDir}/_*.tsx`,
      `!${pagesDir}/api`
    ])),
    // Inject posts separately (with drafts pre-filtered)
    ...posts.map(post => post.file)
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(page => {
      const path = page
        .replace(pagesDir, '')
        .replace('.tsx', '')
        .replace('.mdx', '')
        .replace(/\/index$/, '')
      return `<url><loc>https://francoisbest.com${path}</loc></url>`
    })
    .join('\n  ')}
</urlset>`

  fs.writeFileSync(path.resolve(process.cwd(), 'public/sitemap.xml'), sitemap)
}
