import ConfigPage from '@/components/config'
const linuxPlayer = () => import('@/views/player/linuxPlayer')
const guaplayer = () => import('@/views/player/guaPlayer')
const mainPage = () => import('@/views/mainPage')

export default [
  {
    path: '/',
    component: ConfigPage,
    name: '主页',
  },
  {
    path: '/mainPage',
    name: 'mainPage',
    component: mainPage,
  },
  {
    path: '/linuxplayer',
    name: 'linuxplayer',
    component: linuxPlayer,
  },
  {
    path: '/guaplayer',
    name: 'guaplayer',
    component: guaplayer,
  },
  {
    path: '*',
    redirect: '/',
  },
]
