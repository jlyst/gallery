<template>
    <div class="page-container">
        <div class="page" v-if="u.data">
            <div class='close'><span v-on:click="$router.push(`/u`)">X</span></div>
            <div>
                <h2>Roster</h2>
                <div class="post-list" v-for="(join, idy) in joins">
                    <div>{{join.uname}} ({{join.role}})</div>
                    <div>{{join.email}}</div>
                    <div class='button' v-on:click="remove(join.id)">Remove from Class</div>
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
    export default {
        name: 'Roster',
        created: function() {
            document.title = 'Roster'
        },
        methods: {
            remove: function (id) {
                var r = confirm('This will remove this student from this class!')
                if (r == true) {
                    //need to remove files pdf / image / thumbnail
                    db.collection('joins').doc(id).delete().then(() => {
                        
                    }).catch((e) => {
                        alert(e)
                    })
                }
            }
        },
        data() {
            return {
                u: user,
                joins: []
            }
        },
        firestore() {
            return {
                joins: db.collection('joins')
                    .where('class', '==', this.$route.params.cid) //needs to be classid eventually
            }

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
</style>
