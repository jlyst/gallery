<template>
    <div>
        <hr>
        <h2 v-if="comments.length > 0">Comments</h2>
        <div v-for="(comment, idx) in comments">
            <div v-if="comment.companyname">Member of {{comment.companyname}}</div>
            <div><strong>{{comment.data}}</strong></div>
            <div v-if="isTeacher" class='button' v-on:click="setApprove(comment.id, !comment.approved)">{{comment.approved ? 'Approved (Click to Undo)' : 'Not Approved (Click to Approve)'}}</div>
            <div v-if="isTeacher || comment.uid == u.data.uid" class='button' v-on:click="deleteComment(comment.id)">Delete</div>
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
        props: ['pid', 'puid', 'cid', 'gid'],
        data() {
            return {
                comments: [],
                u: user,
                galleryComments: []
            }
        },
        computed: {
            isTeacher: function() {
                if (user.classes) {
                    var i = user.classes.findIndex(c => {
                        return c.id == this.cid
                    });
                    if (i > -1)
                        if (user.classes[i].role == 'teacher')
                            return true;
                        else return false
                    else return false
                } else return false;
            }
        },
        methods: {
            deleteComment: function(id) {
                var r = confirm('This will forever remove this comment!')
                if (r == true) {
                    db.collection('comments').doc(id).delete().then(() => {

                    }).catch((e) => {
                        alert(e)
                    })
                }
            },
            setApprove: function(id, approved) {
                db.collection('comments').doc(id).update({
                    approved: approved
                });

            }
        },
        watch: {
            galleryComments: function() {
                if (this.isTeacher) {
                    var distinctCompanies = [...new Set(this.galleryComments.map(x => x.companyid))];
                    var results = distinctCompanies.map(c => {
                        return {
                            name: this.galleryComments.find(x => x.companyid == c).companyname,
                            count: this.galleryComments.filter(x => x.companyid == c).length
                        }
                    });
                    console.log(results);
                    db.collection('galleries').doc(this.gid).update({
                        commentCount: this.galleryComments.length,
                        commentCompanyCount: results
                    });
                }
            }
        },
        firestore() {
            return {
                //need is teacher first
                comments: this.isTeacher ? db.collection('comments')
                    .where('pid', '==', this.pid)
                    .orderBy('timestamp', 'desc') : this.puid == this.u.data.uid ? db.collection('comments')
                    .where('pid', '==', this.pid)
                    .where('approved', '==', true)
                    .orderBy('timestamp', 'desc') : db.collection('comments')
                    .where('pid', '==', this.pid)
                    .where('uid', '==', this.u.data.uid)
                    .orderBy('timestamp', 'desc'),
                galleryComments: this.isTeacher ? db.collection('comments')
                    .where('gid', '==', this.gid)
                    .where('approved', '==', true) : db.collection('comments')
                    .where('pid', '==', this.pid)
                    .where('uid', '==', this.u.data.uid)
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
