import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute'

let self
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})
// self.__WB_MANIFEST is default injection point
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST)