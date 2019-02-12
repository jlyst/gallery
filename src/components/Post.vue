<template>
    <div>
        <Navigation title="Post Detail" view="post" :uid="post.uid" :history="`/g/${this.$route.params.gslug}`"></Navigation>
        <div class="page-container">
            <div class="page" v-if="post.data">
                <h1 class="post-title" v-html="post.data.title"></h1>
                <h4 class="post-meta">
                    <div>Gallery <strong> {{post.gtitle}}</strong></div>
                    <div>Class <strong> {{post.classname}}</strong></div>
                    <div v-if="post.award" class="award">Award <strong> {{post.award}}</strong></div>
                </h4>
                <div class='post-artifacts'>
                    <div v-if="post.data.image" class="post-artifact">
                        <a class="link-button" target="_blank" :href="post.data.image">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        <img class="post-img" :src="post.data.image">
                    </div>
                    <div v-if="post.data.text" class="post-artifact">
                        <!--                        <strong>Text</strong>-->
                        <div class="post-txt">{{post.data.text}}</div>
                    </div>
                    <div v-if="post.data.link" class="post-artifact">
                        <a class="link-button" target="_blank" :href="post.data.link">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        <div class="big-iframe-holder" v-if="post.data.link.indexOf('repl')>-1">
                            <iframe class="big-frame " frameborder='no' :src="post.data.link"></iframe>
                        </div>

                        <div class="post-txt" v-else>
                            <a :href="post.data.link" target="_blank">{{post.data.link}}</a>
                        </div>
                    </div>
                    <div v-if="post.data.pdf" class="post-artifact">
                        <a class="link-button" target="_blank" :href="post.data.pdf">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        <div class="big-iframe-holder">
                            <iframe class="big-frame " frameborder='no' :src="post.data.pdf"></iframe>
                        </div>
                    </div>
                </div>
                <div v-if="u.data.uid">
                    <div v-if="isEditor" class="button" v-on:click="deletePost()">Delete Post</div>
                    <div v-if="isPro || isTeacher">
                        <h2><small v-if="u.companies.length > 0">As a Member of {{u.companies[0].name}}</small><br>Provide Feedback</h2>
                        <p v-if="gallery.commentPrompt">{{gallery.commentPrompt}}</p>
                        <textarea ref="commentText" rows="4" cols="50" placeholder="Something good ... Something constructive"></textarea>
                        <br>
                        <div class='button' v-on:click="postComment">Post</div>
                    </div>
                    <CommentList :pid="post.id" :puid="post.uid" :cid="post.classid"></CommentList>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        db,
        user,
        fs
    } from '../main'
    import Navigation from './Navigation.vue'
    import CommentList from './CommentList.vue'
    export default {
        name: 'Post',
        components: {
            Navigation,
            CommentList
        },
        data() {
            return {
                post: {},
                u: user,
                galleries: [{}],
                gallery: {}
            }
        },
        created: function() {
            document.title = 'Post'
        },
        computed: {
            isEditor: function() {
                var is = this.u.data.uid == this.post.uid
                var classMatch = this.u.classes.find(e => e.id == this.post.classid)
                if (classMatch) is = is || classMatch.role == 'teacher'
                return is
            },
            isTeacher: function() {
                var is = false
                var classMatch = this.u.classes.find(e => e.id == this.post.classid)
                if (classMatch) is = classMatch.role == 'teacher'
                return is
            },
            isPro: function() {
                return this.u.companies.length > 0
            }
        },
        watch: {
            galleries: function() {
                this.gallery = this.galleries.length > 0 ? this.galleries[0] : {}
            }
        },
        methods: {
            postComment: function() {
                var self = this
                var cdata = {
                    classid: this.post.classid,
                    classname: this.post.classname,
                    companyname: this.u.companies.length > 0 ? this.u.companies[0].name : null,
                    companyid: this.u.companies.length > 0 ? this.u.companies[0].id : null,
                    pid: this.post.id,
                    gid: this.gallery.id,
                    data: this.$refs.commentText.value,
                    uid: this.u.data.uid,
                    gtitle: this.gallery.title,
                    cprompt: this.gallery.commentPrompt,
                    gslug: this.gallery.slug,
                    timestamp: fs.FieldValue.serverTimestamp()
                }
                db
                    .collection('comments')
                    .add(cdata)
                    .then(function(docRef) {
                        self.$refs.commentText.value = ''
                    })
                    .catch(function(error) {
                        alert('Error adding document: ' + error)
                    })
            },
            deletePost: function() {
                var r = confirm('This will forever remove this post!')
                if (r == true) {
                    //need to remove files pdf / image / thumbnail
                    db.collection('posts').doc(this.post.id).delete().then(() => {
                        this.$router.replace(`/g/${this.$route.params.gslug}`)
                    }).catch((e) => {
                        alert(e)
                    })
                }
            },
        },
        firestore() {
            return {
                post: db.collection('posts')
                    .doc(this.$route.params.pid),
                galleries: db.collection('galleries')
                    .where('slug', '==', this.$route.params.gslug)
                    .limit(1)
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h4 {
        font-weight: 300;
    }

    .post-buttons {
        text-align: right;
    }

    .link-button {
        font-size: 1.5em;
        background: white;
        color: #777;
        padding: 7px 7px 7px 11px;
        border-radius: 7px;
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 10;
    }

    .post-title {
        margin: 3px 0 3px 0;
    }

    .post-meta {
        margin-top: 3px;
        color: #999;
    }

    .post-meta>div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .post-meta>div>strong {
        padding-left: 5px;
    }

    .award {
        color: #c33;
    }

    .post-class-name {
        margin-top: -17px;
    }

    .post-artifacts {
        display: grid;
        /*        grid-template-columns: 1fr 1fr;*/
        grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
        grid-gap: 10px;
        margin-bottom: 50px;
    }

    .post-artifact {
        position: relative;
        box-shadow: 0px 1px 3px #777;
        /*        border: 1px solid #ddd;*/
        border-radius: 2px;
        padding: 7px;
        background: white;
    }

    .big-iframe-holder {
        background: url(../assets/loading.gif) center center no-repeat;
        /*    max-width: 400px;*/
        height: 80vw;
        max-height: 400px;
        /*        500px;*/
        /*        margin-bottom: 5px;*/
        /*        margin-top: 5px;*/
        /*        box-shadow: 0px 1px 5px #777;*/
        overflow: hidden;
        word-break: break-all;
    }

    .big-frame {
        box-sizing: border-box;
        width: 200%;
        height: 160vw;
        max-height: 800px;
        /*        1000px;*/
        border: 0;
        -ms-transform: scale(0.5, 0.5);
        -moz-transform: scale(0.5, 0.5);
        -o-transform: scale(0.5, 0.5);
        -webkit-transform: scale(0.5, 0.5);
        transform: scale(0.5, 0.5);

        -ms-transform-origin: 0 0;
        -moz-transform-origin: 0 0;
        -o-transform-origin: 0 0;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
    }

    .post-img {
        width: 100%;
        display: block;
        /*        box-shadow: 0px 1px 3px #777;*/
    }

    .post-txt {
        /*        box-shadow: 0px 1px 3px #777;*/
        /*        padding: 7px;*/
        margin: 0;
        min-height: 300px;
        word-break: break-word;
        /*
        overflow: hidden;
        text-overflow: ellipsis;
*/
    }

    input:not([type]),
    input[type="text"],
    textarea {
        outline: none;
        font-size: 18px;
        border: 1px solid #aaa;
        border-radius: 3px;
        width: 100%;
        max-width: 550px;
        padding: 5px;
        box-sizing: border-box;
        margin: 3px 0;
        background-color: #fff;
    }

</style>
