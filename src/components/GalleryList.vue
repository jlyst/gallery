<template>
    <div>
        <Navigation title="Galleries" view="front"></Navigation>
        <div class="page-container">
            <div class="page">
                <h1>Let us show you<br>what we have done.</h1>
                
                <div v-if="!u.data.uid">
                        <h3 style="font-weight: 300;">Browse student galleries below, or if you have a code to join a group, <strong><a v-on:click="$router.push(`/u`)">sign in</a></strong> to continue.</h3>
                    
                </div>
                <div v-else-if="u.classes.length < 1 && u.companies.length < 1">
                    <h3 style="font-weight: 300;">Browse student galleries below. We noticed you are signed in but not part of a group. If you have a code to join a group, go to <strong><a v-on:click="$router.push(`/u`)">your profile page</a></strong> to enter your code.</h3>
                </div>
                <div v-else><h3 style="font-weight: 300;">Browse student galleries below. </h3></div>
                <br>
                <hr>
                <div v-if="u.data.uid">
                    <div v-if="u.classes.length>0">
                        <h2>Your Class<span v-if="u.classes.length>1">es</span></h2>
                        <div class="class-listing" v-for="(cls, idy) in u.classes" v-on:click="$router.push(`/g/${cls.id}`)">{{cls.name}}
                        </div>
                    </div>
                </div>
                <div v-if="galleries.length">
                    <h2>Public Galleries</h2>
                    <div v-on:click="$router.push(`/g/${gallery.slug}`)" :class="`gallery-listing cursor ${gallery.status}`" v-for="(gallery, idx) in orderedGalleries" :key="idx">
                        <h2 v-html="gallery.title"></h2>
                        <div v-if="gallery.postCount && gallery.latestPostTimestamp && gallery.status">
                            <div class="metric" v-html="`Posts | ${gallery.postCount}`"></div>
                            <div class="metric">Latest | {{lastPostTime(gallery.latestPostTimestamp.toDate())}}</div>
                            <div class="metric" v-html="`Status | ${gallery.status}`"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        db,
        user
    } from '../main'
    import moment from 'moment'
    import Navigation from './Navigation.vue'
    export default {
        name: 'GalleryList',
        components: {
            Navigation
        },
        created: function() {
            document.title = 'iDEW Galleries'
        },
        data() {
            return {
                galleries: [],
                u: user,
                orderedGalleries: []
            }
        },
        methods: {
            lastPostTime: function(d) {
                if (moment(d).isValid()) {
                    return moment(d).fromNow()
                } else return '-'
            }
        },
        watch: {
            galleries: function () {
                this.orderedGalleries = this.galleries.slice().sort((a, b)=>{
                    if (a.title == "Showcase") return -1;
                    if (b.title == "Showcase") return 1;
                });
            }
        },
        firestore() {
            return {
                galleries: db.collection('galleries')
                    .where('public', '==', true)
                    .orderBy('timestamp', 'desc')
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*
    #gallery-list,
    #sandbox-list {
        margin: 35px 0 35px 0;
        position: relative;
        padding: 1px 0 1px 0;
        min-width: 300px;
    }

    #gallery-list:before {
        position: absolute;
        top: -9px;
        content: "PUBLIC GALLERIES";
        line-height: 18px;
        font-size: 18px;
        color: #C33;
    }

    #sandbox-list:before {
        position: absolute;
        top: -9px;
        content: "YOUR IN-CLASS GALLERIES (NOT PUBLIC)";
        line-height: 18px;
        font-size: 18px;
        color: #C33;
    }
*/

    .class-listing {
        padding: 5px;
        margin-bottom: 5px;
        cursor: pointer;
        background: white;
        width: 550px;
        box-shadow: 0px 1px 3px #777;
    }

    .gallery-listing {
        display: block;
        box-sizing: border-box;
        /*    width: fit-content;*/
        cursor: pointer;
        width: 550px;
        max-width: 100%;
        white-space: nowrap;
        margin-top: 20px;
        padding: 9px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 2px;
        overflow: hidden;
        box-shadow: 0px 1px 3px #777;
    }

    .gallery-listing>h2 {
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
        font-weight: normal;
        font-size: 1.3em;
    }
    
    .archived {
       opacity: .3; 
    }
    
    

    .metric {
        display: inline-block;
        color: #999;
        margin: 7px 12px 0 0;
    }

</style>
