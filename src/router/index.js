import Vue from 'vue'
import Router from 'vue-router'
import GalleryList from '@/components/GalleryList'
import Gallery from '@/components/Gallery'
import User from '@/components/User'
//import Navigation from '@/components/Navigation'
//import PostList from '@/components/PostList'
import Post from '@/components/Post'
import NewPost from '@/components/NewPost'
import AdminGallery from '@/components/AdminGallery'
import GroupLists from '@/components/GroupLists'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'GalleryList',
            component: GalleryList,
            meta: {
                title: 'iDEW Galleries'
            }
    },
        {
            path: '/new',
            name: 'AdminGallery',
            component: AdminGallery,
            meta: {
                title: 'New Gallery'
            }
    },
        {
            path: '/groups',
            name: 'GroupLists',
            component: GroupLists,
            meta: {
                title: 'Manage Groups'
            }
    },
        {
            path: '/g/:slug/edit',
            name: 'AdminGallery',
            component: AdminGallery,
            meta: {
                title: 'Manage Galleries'
            }
    },
        {
            path: '/u',
            name: 'User',
            component: User,
            meta: {
                title: 'User Profile'
            }
    },
        {
            path: '/g/:slug',
            name: 'Gallery',
            component: Gallery,
            props: true,
            meta: {
                title: 'Gallery'
            }
    },
        {
            path: '/g/:slug/c/:cname',
            name: 'Gallery',
            component: Gallery,
            props: true,
            meta: {
                title: 'Gallery'
            }
    },
        {
            path: '/p/:gslug/:pid',
            name: 'Post',
            component: Post,
            props: true,
            meta: {
                title: 'Post'
            }
        },
        {
            path: '/np/:slug',
            name: 'NewPost',
            component: NewPost,
            props: true,
            meta: {
                title: 'New Post'
            }
        }
  ]
})
