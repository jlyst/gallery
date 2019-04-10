// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import pdfjsLib from 'pdfjs-dist'
import loadImage from 'blueimp-load-image'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft, faChevronRight, faUserCircle, faFilePdf, faLink, faImage, faFont, faAward, faSignOutAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faChevronLeft, faChevronRight, faUserCircle, faFilePdf, faLink, faImage, faFont, faAward, faSignOutAlt, faExternalLinkAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueFire)

var liveFirebase = {
  apiKey: 'AIzaSyA3jLSDKdZ5ib3uDpLBDDUuD2ZnJ0JawGQ',
  authDomain: 'idew-2018.firebaseapp.com',
  databaseURL: 'https://idew-2018.firebaseio.com',
  projectId: 'idew-2018',
  storageBucket: 'idew-2018.appspot.com',
  messagingSenderId: '259724907208'
};
var testFirebase = {
    apiKey: "AIzaSyCdsrCTLxDVK3mEupuUVzuwbMsKrDrFlz8",
    authDomain: "gallery-b1a63.firebaseapp.com",
    databaseURL: "https://gallery-b1a63.firebaseio.com",
    projectId: "gallery-b1a63",
    storageBucket: "gallery-b1a63.appspot.com",
    messagingSenderId: "1098701192986"
  };
firebase.initializeApp(liveFirebase)

export const db = firebase.firestore()
export const fs = firebase.firestore // for timestamps
export const storage = firebase.storage().ref()

export const user = {
  signIn: function () {
    // this.data.displayName = "Waiting on authentication ...";
    var provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    provider.setCustomParameters({
      'prompt': 'select_account'
    })
    firebase.auth().signInWithRedirect(provider).then(function (result) {
      // This gives you a Google Access Token.
      // var token = result.credential.accessToken;
      // console.log('on sign-in: ', result.user);
    })
  },
  signOut: function () {
    firebase.auth().signOut()
  },
  data: {
    displayName: 'Waiting on authentication ...',
    uid: ''
  },
  posts: [],
  classes: [],
  comments: [],
  companies: [],
  unsubscribeUserPosts: function () {},
  unsubscribeClasses: function () {},
  unsubscribeComments: function () {},
  unsubscribeCompanies: function () {}
}

export const utils = {
  processFile: function (file) {
    var self = this
    return new Promise(function (resolve, reject) {
      var result = {}
      if (file.type.startsWith('image/')) {
        loadImage(
          file,
          function (img) {
            img.toBlob(function (blob) {
              result.imageBlob = blob
              //                        gallery.data_submit.imageBlob = blob;
              loadImage(
                file,
                function (img) {
                  img.toBlob(function (blob) {
                    result.thumbnailBlob = blob
                    // gallery.data_submit.thumbnailBlob = blob;
                    utils.getBase64(blob).then(rslt => {
                      result.thumbnailSrc = rslt
                      // console.log(result);
                      resolve(result)
                      // $el.html(`<img src='${result}'>`);
                    })
                  })
                }, {
                  maxWidth: 400,
                  minWidth: 400,
                  orientation: true
                } // Options
              )
            })
          }, {
            maxWidth: 1600,
            minWidth: 1600,
            orientation: true
          } // Options
        )
      } else if (file.type == 'application/pdf') {
        result.pdfBlob = file

        // pdf to image
//        var pdfjsLib = window['pdfjs-dist/build/pdf']
        var reader = new FileReader()
        reader.onloadend = function () {
          // console.log(reader.result);
          pdfjsLib.getDocument({
            data: reader.result
          }).then(function (pdf_doc) {
            // pdf_doc is a PDFDocumentProxy object
            pdf_doc.getPage(1).then(function (page) {
              var viewport = page.getViewport(0.5)
              var canvas = document.createElement('canvas')
              var ctx = canvas.getContext('2d')
              canvas.height = viewport.height
              canvas.width = viewport.width

              var renderContext = {
                canvasContext: ctx,
                viewport: viewport
              }
              page.render(renderContext).then(function () {
                // var img_src = canvas.toDataURL();
                canvas.toBlob(function (blob) {
                  utils.processFile(blob).then((r) => {
                    resolve(Object.assign(result, r))
                  })
                })
                // console.log(img_src);
                // $('body').append(`<img src="${img_src}">`);
                // processFile(img_src, $el);
              })
            })
            // console.log('Got it');
          })
        }
        reader.readAsBinaryString(result.pdfBlob)

        // $el.html(`<div><i class="fas fa-check"></i> &nbsp; PDF File Loaded and Ready for Submission!</div>`);
      }
      // console.log(result);
      // return result;
    })
  },

  getBase64: function (file) {
    return new Promise((resolve, reject) => {
      if (file.size / 1024 / 1024 < 4) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
          resolve(reader.result)
        }
        reader.onerror = function (error) {
          reject(error)
        }
      } else {
        alert('File to large.')
        reject(error)
      }
    })
  },

  randomString: function (length) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  },

  slugify: function (string) {
    const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
    const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  },
  getGallery: function (slug) {
    return new Promise(function (resolve, reject) {
      db.collection('galleries').where('slug', '==', slug).get()
        .then(function (querySnapshot) {
          var galleries = []
          querySnapshot.forEach(function (doc) {
            var g = doc.data()
            g.id = doc.id
            galleries.push(g)
          })
          if (galleries.length > 0) resolve(galleries[0])
          else resolve({})
        })
    })
  },
  addGallery: function (newGallery) {
    newGallery.timestamp = fs.FieldValue.serverTimestamp()
    db
      .collection('galleries')
      .add(newGallery)
      .then(function (docRef) {
        console.log('Document written with ID: ', docRef.id)
        // gallery.id = docRef.id;
      })
      .catch(function (error) {
        console.error('Error adding document: ', error)
      })
  },
  updateGallery: function (updatedGallery, id) {
    db
      .collection('galleries')
      .doc(id)
      .update(updatedGallery)
      .then(function (docRef) {
        console.log('Gallery updated')
        // gallery.id = docRef.id;
      })
      .catch(function (error) {
        console.error('Error adding document: ', error)
      })
  },
  deleteGallery: function (gid) {
    db.collection('galleries')
      .doc(gid)
      .delete()
      .then(function () {
        console.log('Document successfully deleted!')
      })
      .catch(function (error) {
        console.error('Error removing document: ', error)
      })
  } // need to mark posts in this gallery with special notice??
}

firebase.auth().onAuthStateChanged(onAuthChange, authError)

function authError (err) {
  console.log(err)
}

function onAuthChange (u) {
  //    console.log('change: ', u);
  user.unsubscribeUserPosts()
  user.unsubscribeClasses()
  user.unsubscribeComments()
  user.unsubscribeCompanies()
  user.unsubscribeUserPosts = function () {}
  user.unsubscribeClasses = function () {}
  user.unsubscribeComments = function () {}
  user.unsubscribeCompanies = function () {}
  user.posts = []
  user.classes = []
  user.comments = []
  user.companies = []
  user.data = {
    displayName: 'Guest',
    uid: ''
  }
  if (u) {
    user.data = u
    loadPosts()
    loadClasses()
    loadComments()
    loadCompanies()
  }
}

function loadPosts () {
  user.unsubscribeUserPosts = db.collection('posts').where('uid', '==', user.data.uid).orderBy('timestamp', 'desc')
    .onSnapshot(function (querySnapshot) {
      var userPosts = []
      querySnapshot.forEach(function (doc2) {
        var p = doc2.data()
        p.id = doc2.id
        userPosts.push(p)
      })
      user.posts = userPosts
      // console.log(user.posts);
    })
}

function loadClasses () {
  user.unsubscribeClasses = db.collection('joins').where('uid', '==', user.data.uid)
    .onSnapshot(function (querySnapshot) {
      var classes = []
      querySnapshot.forEach(function (d) {
        db.collection('classes').doc(d.data().class).get().then(function (doc) {
          var cls = {}
          cls.id = doc.id
          cls.role = d.data().role
          cls.name = doc.data().name
          cls.jid = d.id
          classes.push(cls)
          //                        app.db.collection("users")
          //                            .doc(u.uid)
          //                            .update({
          //                                classes: classes
          //                            });
        })
      })
      user.classes = classes
    })
}

function loadComments () {
  user.unsubscribeComments = db.collection('comments').where('uid', '==', user.data.uid).orderBy('timestamp', 'desc')
    .onSnapshot(function (querySnapshot) {
      var userComments = []
      querySnapshot.forEach(function (doc2) {
        var p = doc2.data()
        p.id = doc2.id
        userComments.push(p)
      })
      user.comments = userComments
    })
}

function loadCompanies () {
  user.unsubscribeCompanies = db.collection('companyJoins').where('uid', '==', user.data.uid)
    .onSnapshot(function (querySnapshot) {
      var companies = []
      querySnapshot.forEach(function (d) {
        db.collection('companies').doc(d.data().companyID).get().then(function (doc) {
          var cmp = {
            role: d.data().role,
            name: doc.data().name,
            jid: d.id
          }
          cmp.id = doc.id
          companies.push(cmp)
          //                        app.db.collection("users")
          //                            .doc(u.uid)
          //                            .update({
          //                                companies: companies
          //                            });
        })
      })
      user.companies = companies
    })
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
