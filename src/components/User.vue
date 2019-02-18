<template>
    <div>
        <!--        <Navigation title="User" history="/"></Navigation>-->
        <div class="page-container">
            <div class="page" v-if="u.data">
                <div class='close'><span v-on:click="$router.push(`/`)">X</span></div>
                <h1>{{u.data.displayName ? u.data.displayName : 'Guest'}}</h1>
                <h5>{{u.data.email ? u.data.email : ''}}</h5>
                <div class="button" v-on:click="u.signIn()" v-if="!u.data.uid">Sign In with Google</div>
                <div class="button" v-on:click="u.signOut()" v-else><font-awesome-icon icon="sign-out-alt" />&nbsp;Sign Out</div>
                <div v-if="u.data.uid">
                    <br>
                    <div>Have a code? Enter it here.</div>
                    <input v-on:keyup.enter="join" placeholder="Code">
                    <hr>
                    <div v-if="u.companies.length>0">
                        <h2>Your Groups</h2>
                        <div class="post-list" v-for="(cmp, idy) in u.companies">
                            <div><strong>{{cmp.name}}</strong></div>
                            <div class='button button-dark' v-on:click="leave('companyJoins',cmp.jid,cmp.name)"><font-awesome-icon icon="sign-out-alt" />&nbsp;Leave Group</div>
                        </div>
                        <hr>
                    </div>
                    <div v-if="u.classes.length>0">
                        <h2>Your Classes</h2>
                        <div class="post-list" v-for="(cls, idy) in u.classes">
                            <div><strong>{{cls.name}} <i>as {{cls.role}}</i></strong></div>
                            <div class='button button-dark' v-on:click="leave('joins',cls.jid,cls.name)"><font-awesome-icon icon="sign-out-alt" />&nbsp;Leave Class</div>
                            <span v-if="cls.role == 'teacher'">
                                <div class='button' v-on:click="$router.push(`/roster/${cls.id}`)">View Roster</div>
                                <div class='button' v-on:click="$router.push(`/code/${cls.id}`)">Display Student Code</div>
                            </span>
                            
                        </div>
                        <hr>
                    </div>
                    <div v-if="u.posts.length>0">
                        <h2>Your Posts</h2>
                        <div class="post-list" v-on:click="$router.push(`/p/${post.gslug}/${post.id}`)" v-for="(post, idx) in u.posts">{{post.data.title}} >>
                        </div>
                        <hr>
                    </div>
                    <div v-if="u.comments.length>0">
                        <h2>Your Comments</h2>
                        <div class="post-list" v-for="(cm, idy) in u.comments" v-on:click="$router.push(`/p/${cm.gslug}/${cm.pid}`)">
                            <div>Comment: {{cm.data}} >></div>
                        </div>
                    </div>
                </div>
                <!--                <UserPostList :uid="u.data.uid" v-if="u.data.uid"></UserPostList>-->
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
    //import Navigation from './Navigation.vue'
    export default {
        name: 'User',
        //  components: {
        // Navigation
        // },
        created: function() {
            document.title = 'User Profile'
        },
        methods: {
            leave: function(col, jid, cname) {
                var r = confirm(`You are about to leave ${cname}.`)
                if (r == true) {
                    db.collection(col).doc(jid).delete()
                }
            },
            join: function(ev) {
                var code = ev.target.value
                var self = this
                db.collection('studentCodes').doc(code)
                    .get()
                    .then(function(doc) {
                        if (doc.data()) {
                            var newdata = {}
                            newdata.class = doc.data().classid // will eventually remove poor field name...
                            newdata.classid = doc.data().classid
                            newdata.uid = self.u.data.uid
                            newdata.role = 'student'
                            newdata.uname = self.u.data.displayName
                            newdata.email = self.u.data.email
                            newdata.timestamp = fs.FieldValue.serverTimestamp()
                            var exists = self.u.classes.filter(c => c.id == doc.data().classid).length
                            if (!exists) db.collection('joins').add(newdata).then((docref) => confirm(doc.data().classid))
                            else {
                                alert(`You are already in that class.`) // as a ${user.data_classes[doc.data().classid].role}`);
                                confirm()
                            }
                        } else {
                            db.collection('teacherCodes').doc(code)
                                .get()
                                .then(function(doc2) {
                                    if (doc2.data()) {
                                        var newdata = {}
                                        newdata.class = doc2.data().classid // will eventually remove poor field name...
                                        newdata.classid = doc2.data().classid
                                        newdata.uid = self.u.data.uid
                                        newdata.role = 'teacher'
                                        newdata.uname = self.u.data.displayName
                                        newdata.email = self.u.data.email
                                        newdata.timestamp = fs.FieldValue.serverTimestamp()
                                        var exists = self.u.classes.filter(c => c.id == doc2.data().classid).length
                                        if (!exists) db.collection('joins').add(newdata).then((docref) => confirm(doc2.data().classid))
                                        else {
                                            alert(`You are already in that class.`) // as a ${user.data_classes[doc2.data().classid].role}`);
                                            confirm()
                                        }
                                    } else {
                                        db.collection('companyCodes').doc(code)
                                            .get()
                                            .then(function(doc3) {
                                                if (doc3.data()) {
                                                    var newdata = {}
                                                    newdata.companyID = doc3.data().companyID
                                                    newdata.uid = self.u.data.uid
                                                    newdata.role = 'member'
                                                    newdata.uname = self.u.data.displayName
                                                    newdata.email = self.u.data.email
                                                    newdata.timestamp = fs.FieldValue.serverTimestamp()
                                                    db.collection('companyJoins').doc(self.u.data.uid).set(newdata).then((docref) => confirm(doc3.data().companyID))
                                                } else {
                                                    alert('Code not found.')
                                                    confirm()
                                                }
                                            })
                                            .catch(function(error) {
                                                console.log('Error getting documents: ', error)
                                            })
                                    }
                                })
                                .catch(function(error) {
                                    console.log('Error getting documents: ', error)
                                })
                        }
                    })
                    .catch(function(error) {
                        console.log('Error getting documents: ', error)
                    })

                function confirm(cid) {
                    //                    app.ee.emit("classes");
                    //                    app.router.navigate(`/`); //${cid}
                }
                // alert(ev.target.value);
                ev.target.value = ''
            }
        },
        data() {
            return {
                u: user
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    

    .close>span {
        cursor: pointer;
    }

    .post-list {
        cursor: pointer;
/*        background: white;*/
        padding: 9px 0;
/*        border-bottom: 1px solid #ccc;*/
/*        margin-bottom: 13px;*/
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
