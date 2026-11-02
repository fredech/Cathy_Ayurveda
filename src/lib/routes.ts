import navJson from '../../data/content/navigation.json'

export interface NavItem {
  id: string
  path: string
  label: string
  navLabel: string | null
}

export const routes = navJson as NavItem[]

/** Chemins de toutes les pages, dans l'ordre du menu. */
export const routePaths: string[] = routes.map((route) => route.path)
