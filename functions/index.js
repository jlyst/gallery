const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.bulkUpdate = functions.https.onRequest((request, response) => {
    admin.firestore().collection('posts').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    makeupdate(doc.id);
                });
            });

        function makeupdate(pid) {
            admin.firestore().collection('comments').where('pid', '==', pid).get()
                .then(snapshot => {
                    var count = 0;
                    var approved = 0;
                    if (snapshot.empty) {
                    }

                    snapshot.forEach(doc => {
                        count++;
                        if (doc.data().approved) approved++;
                    });
                    return admin.firestore().collection('posts').doc(pid).update({
                        commentCount: count,
                        commentApprovedCount: approved
                    });
                })
                .catch(err => {
                });
        }
    response.send("Hello from Firebase!");
});

exports.commentUpdated = functions.firestore
    .document('comments/{cid}')
    .onWrite((change, context) => {
        // Get an object with the current document value.
        // If the document does not exist, it has been deleted.
        const document = change.after.exists ? change.after.data() : null;
        const oldDocument = change.before.data();
        if (document) {
            makeupdate(document.pid);
        } else if (oldDocument) {
            makeupdate(oldDocument.pid);
        }
        //do this once then comment out
//        admin.firestore().collection('posts').get()
//            .then(snapshot => {
//                snapshot.forEach(doc => {
//                    makeupdate(doc.id);
//                });
//            });

        function makeupdate(pid) {
            admin.firestore().collection('comments').where('pid', '==', pid).get()
                .then(snapshot => {
                    var count = 0;
                    var approved = 0;
                    if (snapshot.empty) {
                    }

                    snapshot.forEach(doc => {
                        count++;
                        if (doc.data().approved) approved++;
                    });
                    return admin.firestore().collection('posts').doc(pid).update({
                        commentCount: count,
                        commentApprovedCount: approved
                    });
                })
                .catch(err => {
                });
        }
    
    });
