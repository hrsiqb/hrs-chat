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

const insertUserPhone = (res, rej, uId, phone) => {
  firebase.database().ref(`Users/${uId}/phone`).set(phone)
    .then((result) => {
      res(result)
    })
    .catch(function (error) {
      rej(error)
    })
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
var generateFirebaseKey = (ref) => {
  return firebase.database().ref(ref).push().key //generate a key for the Messages object
}
var insertAddData = (res, rej, data) => {
  firebase.database().ref(`All Ads/${data.iId}`).set(data)
    .then(result => res(result))
    .catch(error => rej(error))
}
function getNumberOfAdds(resolve) {
  var ref = firebase.database().ref("All Ads")
  ref.once("value")
    .then((snapshot) => {
      resolve(snapshot.numChildren())
    })
}
const getAllAdds = (firstRun, addsToAppend, mainResolve, mainReject) => {
  //if number of user has been fetched, apply .on function
  if (firstRun) {
    var ref = firebase.database().ref("All Ads")
    var promise = new Promise((resolve) => getNumberOfAdds(resolve))
    promise.then((numberOfAdds) => {
      let numberOfFetchedAdds = 0
      let fetchedData = []
      let appendedData = []
      ref.on("child_added", (data) => {
        fetchedData.splice(0, 0, data.val())
        if (firstRun) {
          let numberOfAppendedAdds = 0
          numberOfFetchedAdds++
          if (numberOfFetchedAdds === numberOfAdds) {
            firstRun = false
            let optimizedData = []
            if (numberOfAdds > addsToAppend)
              optimizedData = fetchedData.slice(numberOfAppendedAdds, numberOfAppendedAdds + addsToAppend)
            else optimizedData = fetchedData
            appendedData = Array.from(optimizedData)
            let returnData = {
              addsToAppend: 8,
              numberOfAdds,
              firstRun,
              appendedData,
              fetchedData,
            }
            mainResolve(returnData)
          }
        }
      })
    })
  }
  else mainReject("not first run")
}

const getUsers = callback => {
  firebase.database().ref('Users').on('child_added', user => callback(user.val()))
}
const getAddData = (resolve, reject, iId) => {
  firebase.database().ref(`All Ads/${iId}`).once('value')
    .then((returnedData) => resolve(returnedData.val()))
}

const getUserData = (resolve, reject, uId) => {
  firebase.database().ref(`Users/${uId}`).once('value')
    .then((returnedData) => resolve(returnedData.val()))
}
const getMessages = (data, callback) => {
  data.chatIds.map(chatId => {
    firebase.database().ref(`Messages/${chatId}`).on('child_added', snapshot => snapshot.val() && callback(chatId, snapshot.val()))
  })
}
const insertMessage = (userInfo, chatInfo, res = false, rej = false) => {
  let ref = `Messages/${chatInfo.activeChat}`
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
  firebase.database().ref(`Users/${toUid}/requests/${uId}`).set(uId)
    .then(() => res(toUid))
    .catch((error) => rej(toUid))
  firebase.database().ref(`Users/${uId}/sentRequests/${toUid}`).set(toUid)
}
const respondFriendRequest = (uId, toUid, response, res, rej) => {
  firebase.database().ref(`Users/${toUid}/sentRequests/${uId}`).remove()
    .then(() => {
      firebase.database().ref(`Users/${uId}/requests/${toUid}`).remove()
        .then(() => {
          if (response === 'accept') {
            firebase.database().ref(`Users/${uId}/friends/${toUid}`).set(toUid)
            firebase.database().ref(`Users/${toUid}/friends/${uId}`).set(uId)
            res(toUid)
          }
          else res(toUid)
        })
        .catch((error) => rej(toUid))
    })
    .catch((error) => rej(error))
}
const unFriend = (uId, toUid, res, rej) => {
  firebase.database().ref(`Users/${toUid}/friends/${uId}`).remove()
    .then(() => {
      firebase.database().ref(`Users/${uId}/friends/${toUid}`).remove()
        .then(() => res(toUid))
    })
    .catch(() => rej(toUid))
}
const addFriend = (data) => {
  firebase.database().ref(`Users/${data.uId}/friends/${data.fId}`).set(data.fId)
}
export {
  storage,
  firebase as default,
  insertAddData,
  getAllAdds,
  getAddData,
  getUserData,
  getLoginDetails,
  getUsers,
  loginWithFacebook,
  loginWithGoogle,
  signUpWithEmail,
  loginWithEmail,
  insertUserData,
  insertUserPhone,
  logout,
  uploadImage,
  generateFirebaseKey,
  insertMessage,
  addFriend,
  unFriend,
  sendFriendRequest,
  respondFriendRequest,
  getMessages
}