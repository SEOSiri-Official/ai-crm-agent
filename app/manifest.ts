import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SEOSIRI CORE',
    short_name: 'SEOSIRI',
    description: 'AI Sales Agent & Notion Integration',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#0070f3',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  }
}