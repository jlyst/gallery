<template>
    <div>
        <Navigation title="Gallery Detail" history="/"></Navigation>
        <div class="page-container" v-if="gallery">
            <div class="page">
                <h1 id="gallery-title" v-html="gallery.title"></h1>
                <div id="gallery-prompt" v-html="gallery.prompt"></div>
                <div v-if="u.data.uid" v-on:click="gotoAddPost" class="button">Add Post</div>
                <PostList :id="gallery.id" :slug="gallery.slug" :cname="this.$route.params.cname" v-on:post-count="updatePostCount"></PostList>
            </div>
        </div>
    </div>
</template>

<script>
import {
  db, user
} from '../main'
import Navigation from './Navigation.vue'
import PostList from './PostList.vue'
export default {
  name: 'Gallery',
  components: {
    Navigation,
    PostList
  },
  created: function () {
    document.title = 'Gallery'
  },
  data () {
    return {
      galleries: [{}],
      u: user,
      postCount: null,
      gallery: {}
    }
  },
  watch: {
    galleries: function () {
      this.gallery = this.galleries[0]
    }
  },
  methods: {
    gotoAddPost: function () {
      this.$router.push(`/np/${this.$route.params.slug}`)
    },
    updatePostCount (count) {
      this.postCount = count
    }
  },
  firestore () {
    return {
      galleries: db.collection('galleries')
        .where('slug', '==', this.$route.params.slug)
        .limit(1)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#gallery-title {
    position: relative;
    margin-bottom: .9em;
    /*    width: fit-content;*/
}

#gallery-title:focus {
    max-height: none;
}

#gallery-title:before {
    content: "GALLERY";
    position: absolute;
    top: -14px;
    line-height: 14px;
    font-size: 14px;
/*    color: #888;*/
    color: #c33;
    font-weight: 300;
}

#gallery-date {
    margin: none;
    color: #333;
}

#gallery-prompt, #comment-prompt {
    /*    padding: 20px 0 20px 0;*/
    position: relative;
    margin: 10px 0; /*34px*/
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
</style>
