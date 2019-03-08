<template>
    <div>
        <!--        <div v-for="(c, idx) in classes">{{c}}</div>-->
        <select v-model="clss" v-if="classes.length > 1">
            <option value="">All Classes</option>
            <option v-for="c in classes" v-bind:value="utils.slugify(c)">
                {{ c }}
            </option>
        </select>
        <div id="post-list" v-if="!old">
            <div v-for="(post, idx) in getFilteredPosts(clss)" :key="idx" v-on:click="$router.push(`/p/${post.gslug}/${post.id}`)" class="cursor post-card">
                <div class="thumbnail" v-if="post.data.thumbnail" v-bind:style="{backgroundImage : `url('${post.data.thumbnail}')`}"></div>
                <div class="thumbnail" v-else>
                    <div v-if="post.data.text" v-html="post.data.text"></div>
                </div>
                <div class="post-card-subtitle" v-html="post.classname ? post.classname : '&nbsp;'"></div>
                <div class="post-card-title" v-html="post.data.title ? post.data.title : 'Untitled'"></div>
                <div>
                    <span class="attachment-button" v-if="post.data.pdf"><font-awesome-icon class="pointer" icon="file-pdf" /> PDF</span>
                    <span class="attachment-button" v-if="post.data.link"><font-awesome-icon class="pointer" icon="link" /> Link</span>
                    <span class="attachment-button" v-if="post.data.image"><font-awesome-icon class="pointer" icon="image" /> Image</span>
                    <span class="attachment-button" v-if="post.data.text"><font-awesome-icon class="pointer" icon="font" /> Text</span>
                </div>
                <div class='award' v-if="post.award"><font-awesome-icon icon="award" />&nbsp;{{post.award}}</div>
            </div>
            <div v-if="getFilteredPosts(clss).length == 0">No posts yet. Check back later.</div>
        </div>
    </div>
</template>

<script>
import {
  db,
  utils
} from '../main'
export default {
  name: 'PostList',
  props: ['id', 'slug', 'cname'],
  data () {
    return {
      posts: [],
      sortedPosts: [],
      classes: [],
      clss: this.cname ? this.cname : '',
      old: false,
      utils: utils
    }
  },
  watch: {
    posts: function (arr) {
      function compare (a, b) {
        return (a.award || b.award) ? (!a.award ? 1 : !b.award ? -1 : a.award.localeCompare(b.award)) : 0
      }
      this.sortedPosts = arr.slice().sort(compare)
      var fltr = arr.filter(p => p.classname)// in case no class
      var cs = fltr.map(p => p.classname)
      this.classes = [...new Set(cs)] // get unique
      this.classes.sort()
      this.$emit('post-count', arr.length)
    },
    clss: function (c) {
      if (c) this.$router.replace(`/g/${this.slug}/c/${c}`)
      else this.$router.replace(`/g/${this.slug}/`)
    }
  },
  methods: {
    getFilteredPosts: function (c) {
      if (c) return this.sortedPosts.filter(post => this.utils.slugify(post.classname) == c)
      else return this.sortedPosts
    }
  },
  firestore () {
    return {
      posts: db.collection('posts')
        .where('gid', '==', this.id)
        .orderBy('timestamp', 'desc')
      // .orderBy('award', 'desc')
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    select {
        font-size: 1.2em;
        outline: none;
        border: 1px solid #ccc;
        height: 2em;
        margin: auto;
        display: block;
            color: #c33;
        background: #f0f0f0;
        width: 100%;
    }

    #post-list,
    #user-post-list {
        margin: 25px 0px 10px 0px;
        position: relative;
        display: grid;
        grid-gap: 25px;
        grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    }

    .post-card {
        position: relative;
        box-sizing: border-box;
        padding: 5px;
        /*    margin: 10px;*/
        /*        flex: 1 1 270px;*/
        border: 1px solid #bbb;
        background: white;
        border-radius: 2px;
        display: inline-block;
        cursor: pointer;
        box-shadow: 0px 1px 5px #777;
    }

    .post-card.owner {
        background-color: ghostwhite;
    }

    .post-card-title {
        font-size: 22px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    .post-card-title>span {
        color: rgba(0, 0, 0, .3);
        position: absolute;
        top: 0px;
        right: 0;
        /*    background: white;*/
    }

    .post-card-subtitle {
        color: #777;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .attachment-button {
        margin-top: 5px;
        background: #eee;
        color: #555;
        padding: 5px 9px;
        border-radius: 3px;
        display: inline-block;
    }

    .thumbnail {
        position: relative;
        display: grid;
        align-items: center;
        text-align: center;
        background-color: ghostwhite;
        background-size: cover;
        background-position: center;
        box-sizing: border-box;
        /*    width: 280px;*/
        height: 200px;
        /*
    max-width: 250px;
    max-height: 250px;
    width: calc(30vw - 27px);
    height: calc(30vw - 27px);
*/
        margin: 0 0 3px 0;
        padding: 7px;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, .2);
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 24px;
        /*    overflow: hidden;*/
        /*    padding: 5px;*/
    }

    .thumbnailText {
        font-size: 24px;
        padding: 8px;
    }

    .thumbnail-placeholder {
        font-size: 28px;
        color: #888;
        background-color: ghostwhite;
        border: 1px dashed #aaa;
    }

    .thumbnail-placeholder>div,
    #upload-image>div,
    #upload-pdf>div {
        line-height: 200px;
    }

    .thumbButton {
        padding: 7px 5px 2px 5px;
        border-radius: 0 5px 0 5px;
        background: yellow;
        border-left: 1px solid #aaa;
        border-bottom: 1px solid #aaa;
    }

    .thumbButtonContainer {
        position: absolute;
        top: -15px;
        right: 0;
        font-size: 22px;
        /*    text-align: right;*/
        color: #888;
        width: 100%;
        height: 100%;
    }

    .award {
        background-color: #c33;
        color: white;
        padding: 5px;
        margin-top: 5px;
        border-radius: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .post-artifacts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
        margin-bottom: 50px;
    }

    .small-iframe-holder {
        /*    background:url(../imgs/loading.gif) center center no-repeat;*/
        height: 100%;
        margin-bottom: 50px;
    }

    .big-iframe-holder {
        /*    background:url(../imgs/loading.gif) center center no-repeat;*/
        /*    max-width: 400px;*/
        height: 40vw;
        max-height: 400px;
        /*        500px;*/
        margin-bottom: 5px;
        margin-top: 5px;
        box-shadow: 0px 1px 5px #777;
        overflow: hidden;
        word-break: break-all;
    }

    .big-iframe-holder>h5 {
        min-width: 100px;
        margin: 15px;
    }

    .small-frame {
        box-sizing: border-box;
        width: 200%;
        height: 400px;
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

</style>
