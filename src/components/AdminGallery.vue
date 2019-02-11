<template>
    <div>
        <!--        <Navigation title="User" history="/"></Navigation>-->
        <div class="page-container">
            <div class="page">
                <div class='close'><span v-on:click="$router.push(`/`)">X</span></div>
                <h1>Admin Gallery</h1>
                <div v-if="u.data && ready">
                    <div>Title</div>
                    <input :value="gallery.title" v-on:input="updateItem('title',$event)">
                    <div>Prompt</div>
                    <textarea :value="gallery.prompt" v-on:input="updateItem('prompt',$event)"></textarea>
                    <div>Comment Prompt</div>
                    <textarea :value="gallery.commentPrompt" v-on:input="updateItem('commentPrompt',$event)"></textarea>
                    <div>Status</div>
<!--                    <input :value="gallery.status" v-on:input="updateItem('status',$event)">-->
                    <select v-model="gallery.status" v-on:change="updateItem('status',$event)"><option value='open' selected>Open</option><option value="closed">Closed</option></select> <br>
<!--                    <div>Public <input type="checkbox" :checked="gallery.public" v-on:input="updateItem('public',$event)"></div>-->
                    <div v-if="u.data && slug" class="button" v-on:click="saveGallery('update', $event)">Update Gallery</div>
                    <div v-if="u.data && slug" class="button" v-on:click="deleteGallery($event)">Delete Gallery</div>
                    <div v-else class="button" v-on:click="saveGallery('create', $event)">Create Gallery</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        db,
        user,
        utils
    } from '../main'
    export default {
        name: 'Gallery',
        data() {
            return {
                u: user,
                slug: this.$route.params.slug ? this.$route.params.slug : null,
                gid: '',
                gallery: {},
                original: {},
                ready: false
            }
        },
        created: function(){
            document.title = "Manage Galleries";
        },
        methods: {
            updateItem: function(type, ev) {
                if (type == 'public')
                    this.gallery[type] = ev.target.checked;
                else this.gallery[type] = ev.target.value;
                console.log(this.gallery);
            },
            deleteGallery: function(ev) {
                var r = confirm("You will now forever delete this gallery!");
                if (r == true) {
                    ev.target.setAttribute("style", "pointer-events:none");
                    ev.target.innerHTML = "deleting...";
                    if (this.gid) {
                        utils.deleteGallery(this.gid);
                        this.$router.push(`/`);
                    }
                } else {
                    //txt = "You pressed Cancel!";
                }


            },
            saveGallery: function(op, ev) {
                ev.target.setAttribute("style", "pointer-events:none");
                ev.target.innerHTML = "saving...";
                if (op == 'create') this.createGallery(this.gallery);
                else this.updateGallery(this.gallery);
            },
            createGallery: function(g) {
                if (!this.gallery.slug) this.gallery.slug = utils.randomString(6);
                this.gallery.public = true;
                utils.addGallery(this.gallery);
                this.$router.push(`/g/${this.gallery.slug}`)
            },
            updateGallery: function(g) {
                utils.updateGallery(this.gallery, this.gid);
                this.$router.push(`/g/${this.gallery.slug}`)
            }
        },
        created: function() {
            utils.getGallery(this.slug).then((res) => {
                this.gid = res.id ? res.id : null;
                var props = ['title', 'slug', 'prompt', 'status', 'commentPrompt'];
                for (var prop in res) {
                    if (props.indexOf(prop) == -1) delete res[prop];
                }
                //console.log(res);
                if (!res.status) res.status = "open";
                this.gallery = res;
                this.original = res;
                this.ready = true;
            });
        }

    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .close {
        text-align: right;
        font-weight: 300;
        font-size: 28px;
        line-height: 55px;
        margin: -11px 11px;
    }

    .close>span {
        cursor: pointer;
    }

    .post-list {
        cursor: pointer;
        background: white;
        padding: 9px;
        border: 1px solid #ddd;
        max-width: 400px;
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
