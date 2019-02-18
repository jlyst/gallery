<template>
    <div class="page-container">
        <div class="page" v-if="u.data">
            <div class='close'><span v-on:click="$router.push(`/u`)">X</span></div>
            <div>
                <h2>Student Code</h2>
                <div class="big">{{code}}</div>
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
        watch: {
            codes: function (cs) {
                console.log(cs);
                if (cs.length > 0) this.code = cs[0].id; 
            }
        },
        data() {
            return {
                u: user,
                codes: [],
                code: ""
            }
        },
        firestore() {
            return {
                codes: db.collection('studentCodes')
                    .where('classid', '==', this.$route.params.cid)
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

    .big {
        font-size: 144px;
    }
</style>
