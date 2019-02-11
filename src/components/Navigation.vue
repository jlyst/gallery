<template>
    <div id="nav-bar">
        <div id="nav-container">
            <div id="nav-left">
                <div v-if="history" v-on:click="goBack(history)" class="cursor"><i class="pointer fas fa-chevron-left"></i></div>
                <div v-else class="logo">&nbsp;</div>
            </div>
            <div id="nav-center">
                <div class="nav-center-text" v-html="title"></div>
            </div>
            <div id="nav-right">
                <div v-if="view=='front'">
                    <div v-if="!u.data.uid" class="button" v-on:click="$router.push('/u')">SIGN IN</div>
                    <div class="profile" v-else v-on:click="$router.push('/u')">&nbsp;<i class="fas fa-user-circle"></i></div>
<!--                    <img v-else class="user-photo" v-on:click="$router.push('/u')" :src="u.data.photoURL">-->
                </div>
<!--
                <div v-if="view=='post'">
                    <div v-if="u.data.uid">
                        <div v-if="u.data.uid == uid" class="button" v-on:click="$router.push('/u')">Delete</div>
                    </div>
                </div>
-->
            </div>
        </div>
    </div>
</template>

<script>
import {
  user
} from '../main'

export default {
  name: 'Navigation',
  props: ['title', 'view', 'history', 'uid'],
  data () {
    return {
      u: user
    }
  },
  methods: {
    goBack: function (h) {
      window.history.length > 1 && h != '/'
        ? this.$router.go(-1)
        : this.$router.push(h)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .logo {
        display: block;
        background-image: url(../assets/logo.png);
        background-size: contain;
        background-position: left;
        background-repeat: no-repeat;
        height: 31px;
        width: 100%;
        box-sizing: border-box;
        margin: 12px 0px;
    }

    .profile>i {
        font-size: 32px;
        line-height: 55px;
        cursor: pointer;
    }

    .user-photo {
        cursor: pointer;
        display: inline-block;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        margin: 11px 0;
        border: 1px solid #aaa;
    }

    a {
        text-decoration: none;
    }

    #nav-bar {
        background-color: white;
        border-bottom: 1px solid #ddd;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    #nav-container {
        display: flex;
        height: 55px;
        line-height: 55px;
        padding: 0px 12px 0px 8px;
        color: #666;
        font-size: 21px;
        padding-left: calc(100vw - 100% + 8px);
        max-width: 950px;
        margin: auto;
    }

    #nav-left,
    #nav-right,
    #nav-center {
        padding: 0 11px;
        flex: 1;
        flex-wrap: nowrap;
        align-items: center;
        /*    height: 25px;*/
        /*    line-height: inherit;*/
        display: inline-block;
        line-height: inherit;
    }

    #nav-center {
        text-align: center;
    }

    #nav-right {
        text-align: right;
    }

    .nav-left-text {}

    .nav-center-text {
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 100%;
        text-align: center;
    }

    @media only screen and (max-width: 950px) {
        #nav-container {
            padding-left: 8px;
        }
    }

</style>
