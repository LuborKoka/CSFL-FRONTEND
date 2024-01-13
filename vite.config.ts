import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'

const uuidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
const seasonNamePattern = '([a-zA-Z0-9._~-]|%[0-9a-fA-F]{2})*'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({ 
            registerType: 'autoUpdate',
            manifest: {
                lang: 'sk',
                short_name: 'CSFL',
                name: 'Czech and Slovak Formula League',
                start_url: '/',
                display: 'standalone',
                theme_color: '#EFEFEF',
                background_color: '#000606',
                icons: [
                    {
                        src: '/favicon.ico',
                        sizes: '64x64 32x32 24x24 16x16',
                        type: 'image/x-icon'
                    },
                    {
                        src: '/logo192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/logo256.png',
                        sizes: '256x256',
                        type: 'image/png'
                    },
                    {
                        src: '/logo512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: new RegExp('.(?:png|jpg|jpeg|svg)$'),
                        handler: 'CacheFirst',
                        options: {
                          cacheName: 'images',
                          expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 365 * 24 * 60 * 60,
                          },
                        },
                    },
                    {
                        urlPattern: new RegExp('.(?:js|css)$/'),
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'js-css',
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 365 * 24 * 60 * 60
                            },
                        }
                    },
                    {
                        urlPattern: ({ url }) => {isNetworkResponse(url.pathname)},
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'API-responses',
                            expiration: {
                                maxAgeSeconds: 60 * 24 * 60 * 60,
                                maxEntries: 60
                            }
                        }
                    }
                ]
            }
        })
        
    ],
    server: {
        port: 3000
    }
});





function isNetworkResponse(uri: string) {
    const patterns = [
        new RegExp(`/races/${uuidPattern}/(results|reports|drivers)/$`),
        new RegExp(`/rules/$`),
        new RegExp(`/seasons/${seasonNamePattern}/standings/$`),
        new RegExp(`/season-drivers/${seasonNamePattern}/$`),
        new RegExp(`/schedule/${seasonNamePattern}/$`)
    ]

    for (const pattern of patterns) {
        if (pattern.test(uri)) {
            return true
        }
    }
    
    return false
}