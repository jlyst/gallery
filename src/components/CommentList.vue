<template>
    <div>
        <hr>
        <h2 v-if="comments.length > 0">Comments</h2>
        <div v-for="(comment, idx) in comments">
            <div v-if="comment.companyname">Member of {{comment.companyname}}</div>
            <div><strong>{{comment.data}}</strong></div>
            <div v-if="u.classes.findIndex(c=>{return c.id==cid}) > -1" class='button'>{{comment.approve ? 'Approved' : 'Not Approved'}}</div> <div v-if="u.classes.findIndex(c=>{return c.id==cid}) > -1 || comment.uid == u.data.uid" class='button' v-on:click="deleteComment(comment.id)">Delete</div>
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
  name: 'CommentList',
  props: ['pid', 'puid', 'cid'],
  data () {
    return {
      comments: [],
      u: user
    }
  },
  computed: {
    //            isTeacher: user.classes ? user.classes.findIndex(c=>{return c.id==this.cid}) > -1 : false
  },
  methods: {
    deleteComment: function (id) {
      var r = confirm('This will forever remove this comment!')
      if (r == true) {
        db.collection('comments').doc(id).delete().then(() => {

        }).catch((e) => {
          alert(e)
        })
      }
    }
  },

  firestore () {
    return {
      comments: this.puid == this.u.data.uid ? db.collection('comments')
        .where('pid', '==', this.pid)
        .orderBy('timestamp', 'desc')
        : db.collection('comments')
          .where('pid', '==', this.pid)
          .where('uid', '==', this.u.data.uid)
          .orderBy('timestamp', 'desc')
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
