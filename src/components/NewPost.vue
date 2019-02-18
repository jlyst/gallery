<template>
    <div>
        <Navigation title="New Post" history="`/g/${gslug}`"></Navigation>
        <div class="page-container">
            <div class="page" v-if="u.data.uid && galleries[0]">
                <h1 v-html="galleries[0].title"></h1>
                <h3 v-html="galleries[0].prompt"></h3>
                <div>Title</div>
                <input v-on:input="updateSub('title',$event)"><br>
                <span v-if="submission.text==null" class="button" v-on:click="add('text')">Add Text</span>
                <span v-if="submission.image==null" class="button">Add Image<input class='button' type='file' accept='image/*' id='add-file' v-on:change="add('image',$event);"></span>
                <span v-if="submission.pdf==null" class="button">Add PDF<input class='button' type='file' accept='application/pdf' id='add-file' v-on:change="add('pdf',$event);"></span>

                <span v-if="submission.link==null" class="button" v-on:click="add('link')">Add Link</span>
                <br>
                <textarea v-if="submission.text!=null" v-on:input="updateSub('text',$event)" placeholder="Enter your text here."></textarea>
                <input v-if="submission.link!=null" v-on:input="updateSub('link',$event)" placeholder="Enter your link here.">
                <img v-if="submission.pdf!=null" :src="submission.pdf.thumbnailSrc" width="200">
                <img v-if="submission.image!=null" :src="submission.image.thumbnailSrc" width="200">
                <hr>
                <div class="button button-highlight" v-on:click="submit">Submit</div>
                <div class="button" v-on:click="$router.push(`/g/${gslug}`)">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        db,
        user,
        fs,
        storage,
        utils
    } from '../main'
    import Navigation from './Navigation.vue'
    export default {
        name: 'NewPost',
        components: {
            Navigation
        },
        data() {
            return {
                galleries: [{}],
                posts: [{}],
                u: user,
                submission: {
                    title: null,
                    text: null,
                    image: null,
                    link: null,
                    pdf: null
                },
                gslug: this.$route.params.slug,
                text: undefined,
                utils: utils
            }
        },
        created: function() {
            document.title = 'New Post'
        },
        computed: {
            clss: function() {
                var arrClassOfGallery = this.u.classes.filter(c => c.id == this.galleries[0].id) // find if gallery is class gallery
                var isClassGallery = arrClassOfGallery.length > 0
                var isPublic = this.galleries[0].public
                var firstClass = this.u.classes[0]
                if (isClassGallery) return arrClassOfGallery[0]
                else if (isPublic && firstClass) return firstClass
            },
            gallery: function() {
                return this.galleries[0]
            }
        },
        methods: {
            add: function(type, $ev) {
                if (['text', 'title', 'link'].indexOf(type) > -1) {
                    this.submission[type] = ''
                } else {
                    this.utils.processFile($ev.target.files[0]).then((r) => {
                        this.submission[type] = r
                    })
                }
                // console.log(this.submission);
            },
            submit: function(ev) {
                ev.target.setAttribute('style', 'pointer-events:none')
                ev.target.innerHTML = 'loading...'
                if (this.clss) {
                    if (this.submission.pdf != null) {
                        this.storeFile('pdf').then(() => {
                            if (this.submission.image != null) {
                                this.storeFile('image').then(() => {
                                    this.firestorePost()
                                })
                            } else {
                                this.firestorePost()
                            }
                        })
                    } else
                    if (this.submission.image != null) {
                        this.storeFile('image').then(() => {
                            this.firestorePost()
                        })
                    } else {
                        this.firestorePost()
                    }
                }
                // this.firestorePost();
            },
            storeFile: function(type) {
                var self = this
                return new Promise(function(resolve, reject) {
                    delete self.submission[type].thumbnailSrc
                    var fileName = ''
                    if (type == 'image') {
                        var ext = '.' + self.submission.image.imageBlob.type.substring(self.submission.image.imageBlob.type.indexOf('/') + 1)
                        fileName = self.clss.name + '-' + self.utils.randomString(4) + ext
                    } else {
                        fileName = self.clss.name + '-' + self.utils.randomString(4) + '.pdf'
                    }
                    storage.child('posts/' + fileName).put(self.submission[type][type + 'Blob']).then((snapshot) => {
                        snapshot.ref.getDownloadURL().then(function(downloadURL) {
                            var ext2 = '.' + self.submission[type][type + 'Blob'].type.substring(self.submission[type][type + 'Blob'].type.indexOf('/') + 1)
                            var fileName2 = 'thumb-' + fileName.slice(0, -4) + ext2
                            storage.child('posts/' + fileName2).put(self.submission[type]['thumbnailBlob']).then((snapshot2) => {
                                snapshot2.ref.getDownloadURL().then(function(downloadURL2) {
                                    self.submission.thumbnail = downloadURL2
                                    self.submission[type] = downloadURL
                                    self.submission[type + 'Name'] = fileName
                                    self.submission['thumbnailName'] = fileName2
                                    resolve()
                                })
                            }).catch()
                        })
                    }).catch()
                })
            },
            firestorePost: function() {
                var self = this
                // console.log(this.submission);
                db
                    .collection('posts')
                    .add({
                        // need to add jid to associate post with a class membership, OR add class id
                        classid: this.clss.id,
                        classname: this.clss.name,
                        gid: this.gallery.id,
                        data: this.submission,
                        uid: this.u.data.uid,
                        gtitle: this.gallery.title,
                        gprompt: this.gallery.prompt ? this.gallery.prompt : '',
                        cprompt: this.gallery.commentPrompt ? this.gallery.commentPrompt : '',
                        gslug: this.gslug,
                        timestamp: fs.FieldValue.serverTimestamp()
                    })
                    .then(function(docRef) {
                        // console.log(docRef);
                        self.$router.push(`/g/${self.gslug}`)
                        db.collection('galleries').doc(self.galleries[0].id).update({
                                postCount: self.posts.length,
                                latestPostTimestamp: fs.FieldValue.serverTimestamp()
                            })
                            .then(function() {
                                console.log("Gallery metadata updated");
                            })
                            .catch(function(err) {
                                console.log("error updating postcount or latestPostTimestamp", err);
                            });
                    })
                    .catch(function(error) {
                        alert('Error adding document: ' + error)
                    })
            },
            updateSub: function(prop, ev) {
                this.submission[prop] = ev.target.value
            }
        },
        firestore() {
            return {
                galleries: db.collection('galleries')
                    .where('slug', '==', this.$route.params.slug)
                    .limit(1),
                posts: db.collection('posts')//just need this for the post count to update gallery meta data
                    .where('gslug', '==', this.$route.params.slug)
                    .orderBy('timestamp', 'desc')
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1>small {
        font-weight: 300;
    }

    #gallery-prompt,
    #comment-prompt {
        /*    padding: 20px 0 20px 0;*/
        position: relative;
        margin: 35px 0px;
        /*34px*/
        font-weight: 400
            /*    width: fit-content;*/
    }

    #gallery-prompt:before {
        content: "STUDENT INSTRUCTIONS";
        position: absolute;
        top: -18px;
        line-height: 14px;
        font-size: 14px;
        /*    color: #888;*/
        color: #c33;
        font-weight: 300;
    }

    input[type=file] {
        /*    font-size: 100px;*/
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
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
