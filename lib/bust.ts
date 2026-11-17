import { revalidatePath, revalidateTag } from 'next/cache'

export function bust() {
  for (const t of ['products', 'branches', 'blog', 'gallery']) revalidateTag(t, { expire: 0 })
  revalidatePath('/', 'layout')
}