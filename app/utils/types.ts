export type ContentButton = {
  label: string
  icon?: string
  to?: string
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
  variant?: 'solid' | 'outline' | 'subtle' | 'soft' | 'ghost' | 'link'
  target?: '_blank' | '_self'
}
