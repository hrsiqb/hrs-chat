import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/auth'


var firebaseConfig = {
  apiKey: "AIzaSyAQxj9Oys3P60XNSmxCyo-W0Hvavax_5gk",
  authDomain: "hrs-chat.firebaseapp.com",
  databaseURL: "https://hrs-chat.firebaseio.com",
  projectId: "hrs-chat",
  storageBucket: "hrs-chat.appspot.com",
  messagingSenderId: "702674345651",
  appId: "1:702674345651:web:abe7e3e9cd7101d4abdac6",
  measurementId: "G-EJPBELCG96"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()

function loginWithGoogle(res, rej) {
  // Google Auth Config
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(function (result) {
      res(result)
    })
    .catch(function (error) {
      rej(error)
    });
}
const loginWithFacebook = (res, rej) => {
  var provider = new firebase.auth.FacebookAuthProvider()
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      res(result)
    })
    .catch((error) => {
      rej(error)
    });
}
const loginWithEmail = (res, rej, data) => {
  firebase.auth().signInWithEmailAndPassword(data.email, data.password)
    .then((result) => {
      res(result)
    })
    .catch(function (error) {
      // Handle Errors here.
      rej(error)
    });
}
const signUpWithEmail = (res, rej, data) => {
  firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
    .then((result) => {
      res(result)
    })
    .catch(function (error) {
      // Handle Errors here.
      rej(error)
    });
}
const insertUserData = (res, rej, provider, data) => {
  if (data.imageFile && provider === 'password') {
    new Promise((resolve, reject) => uploadImage(resolve, reject,
      { folder: 'userMedia', image: data.imageFile, name: data.uId }))
      .then((url) => {
        data.imageFile = url
        firebase.database().ref(`Users/${data.uId}`).set(data)
          .then(result => res(result))
          .catch(error => rej(error))
      })
      .catch(error => rej(error))
  }
  else {
    firebase.database().ref(`Users/${data.uId}`).set(data)
      .then(result => res(result))
      .catch(error => rej(error))
  }
}
const uploadImage = (res, rej, data) => {
  firebase.storage().ref().child(`images/${data.folder}/${data.name}`).put(data.image)
    .then((snapshot) => {
      snapshot.ref.getDownloadURL()
        .then(url => res(url))
        .catch(error => rej(error))
    })
    .catch(error => rej(error))
}
const getLoginDetails = (res, rej) => {
  var run = true//flag to indicate getLoginDetails() has been called
  firebase.auth().onAuthStateChanged(function (user) {
    if (run) {//run only if the getLoginDetails() has been called
      run = false
      if (user) {
        // User is signed in.
        let provider = user.providerData[0].providerId
        if (provider !== 'password') {
          res({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uId: user.uid,
            isLoggedIn: true
          })
        }
        else {
          new Promise((res, rej) => getUserData(res, rej, user.uid))
            .then((data) => {
              res({
                displayName: data.name,
                email: user.email,
                photoURL: data.imageFile,
                friends: data.friends,
                phone: data.phone,
                uId: user.uid,
                isLoggedIn: true
              })
            })
        }
        // var emailVerified = user.emailVerified;
        // var isAnonymous = user.isAnonymous;
      }
      else {
        // User is signed out.
        rej(false)
      }
    }
  })
}
function logout(res, rej) {
  firebase.auth().signOut()
    .then((result) => {
      res(result)
    })
    .catch((error) => {
      rej(error)
    })
}
function getNumberOfChildren(resolve, ref) {
  firebase.database().ref(ref).once("value")
    .then((snapshot) => resolve(snapshot.numChildren()))
}
var generateFirebaseKey = (ref) => {
  return firebase.database().ref(ref).push().key //generate a key for the Chats object
}

const getUsers = callback => {
  firebase.database().ref('Users').on('child_added', user => callback(user.val()))
}

const getUserData = (resolve, reject, uId) => {
  firebase.database().ref(`Users/${uId}`).once('value')
    .then((returnedData) => resolve(returnedData.val()))
}
const removeChat = chatId => firebase.database().ref(`Chats/${chatId}`).remove()

const generateChatId = (uId, fId) => {
  if (fId < uId) return `${fId}_${uId}`
  return `${uId}_${fId}`
}
const insertMessage = (userInfo, chatInfo, res = false, rej = false) => {
  let ref = `Chats/${chatInfo.activeChat}`
  let key = generateFirebaseKey(ref)
  firebase.database().ref(`${ref}/${key}`).set(
    {
      message: chatInfo.newMessage,
      fromUid: userInfo.uId,
      key
    })
    .then(result => res && res('done'))
    .catch(error => rej && rej(error.message))
}
const sendFriendRequest = (uId, toUid, res, rej) => {
  firebase.database().ref(`Users/${uId}/sentRequests/${toUid}`).set(toUid)
  firebase.database().ref(`Users/${toUid}/requests/${uId}`).set(uId)
    .then(() => res(toUid))
    .catch((error) => rej(toUid))
}
const respondFriendRequest = (uId, toUid, response, res, rej) => {
  if (response === 'accept') {
    firebase.database().ref(`Users/${uId}/friends/${toUid}`).set(toUid)
    firebase.database().ref(`Users/${toUid}/friends/${uId}`).set(uId)
    res(toUid)
  }
  else res(toUid)
  firebase.database().ref(`Users/${toUid}/sentRequests/${uId}`).remove()
  firebase.database().ref(`Users/${uId}/requests/${toUid}`).remove()
    .then(() => res(toUid))
    .catch(() => rej(toUid))
}
const unFriend = (uId, toUid, res, rej) => {
  firebase.database().ref(`Users/${toUid}/friends/${uId}`).remove()
  firebase.database().ref(`Users/${uId}/friends/${toUid}`).remove()
    .then(() => res(toUid))
    .catch(() => rej(toUid))
}
const addFriend = data => {
  firebase.database().ref(`Users/${data.uId}/friends/${data.fId}`).set(data.fId)
}
const addMessagesEventListener = (cId, callback) => {
    firebase.database().ref(`Chats/${cId}`).on('child_added', snapshot => snapshot.val() && callback(cId, snapshot.val()))
}
const addUsersChildEventListener = (ref, uId, callback) => {
  console.log(uId)
  firebase.database().ref(`Users/${uId}/${ref}`).on('child_added', snapshot => {
    callback('added', snapshot.val())
  })
  firebase.database().ref(`Users/${uId}/${ref}`).on('child_removed', snapshot => {
    callback('removed', snapshot.val())
  })
}
const addUserUpdatedEventListener = (uId, callback) => {
  firebase.database().ref(`Users/${uId}`).on('value', snapshot => {
    callback(snapshot.val())
  })
}
const killFriendsEventLisner = uId => firebase.database().ref(`Users/${uId}/friends`).off()
const killChatEventListener = chatId => firebase.database().ref(`Chats/${chatId}`).off()
const killAllEventLisners = ref => firebase.database().ref(ref).off()
export {
  storage,
  firebase as default,
  addMessagesEventListener,
  addUsersChildEventListener,
  addUserUpdatedEventListener,
  killAllEventLisners,
  killChatEventListener,
  killFriendsEventLisner,
  getUserData,
  getLoginDetails,
  getUsers,
  loginWithFacebook,
  loginWithGoogle,
  signUpWithEmail,
  loginWithEmail,
  insertUserData,
  logout,
  uploadImage,
  generateFirebaseKey,
  removeChat,
  generateChatId,
  insertMessage,
  addFriend,
  unFriend,
  sendFriendRequest,
  respondFriendRequest
}
