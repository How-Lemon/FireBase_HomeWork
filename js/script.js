$(document).ready(function(){
  // Initialize Firebase
   var config = {
    apiKey: "AIzaSyCOu72-knogsHy8LPLQ1vntPMvGblLHIdE",
    authDomain: "fireauth-45eb9.firebaseapp.com",
    databaseURL: "https://fireauth-45eb9.firebaseio.com",
    projectId: "fireauth-45eb9",
    storageBucket: "fireauth-45eb9.appspot.com",
    messagingSenderId: "518970285942"
  };
  firebase.initializeApp(config);
  var dbRef = firebase.database().ref().child('object');
  var edit_dbRef;
  var chatroom_dbRef;
  var loginInfo = {};
  var loginState = false;
  const $email = $('#email');
  const $password = $('#password');
  const $btnSignIn = $('#btnSignIn');
  const $btnSignUp = $('#btnSignUp');
  const $btnSignOut = $('#btnSignOut');
  const $signInfo = $('#sign-info');
  const $loginPage = $('#loginPage');
  const $chatRoom = $('#chatRoom');
  var $nameDisplay = $('#nameDisplay');

  $nameDisplay.html(loginInfo.displayName);
//$chatRoom.css('display','none');
  // SignIn
  $btnSignIn.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    $signInfo.html("Logging in...");
    // signIn
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(function(e){
      console.log(e.message);
      $signInfo.html(e.message);
    });
  });

  // SignUp
  $btnSignUp.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();

    // signUp
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(function(e){
      console.log(e.message);
      $signInfo.html(e.message);
    });
    promise.then(function(){
      window.location.href("./profile_edit.html");
    });
  });

  // Listening Login User
  firebase.auth().onAuthStateChanged(function(user){
    if(user) {
      
      console.log(user);
      $signInfo.html(user.email+" is login...");
      $loginPage.fadeOut()
      //$chatRoom.css('display','block');
      $loginPage.css('display','none');
      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: "+profile.providerId);
        console.log("  Provider-specific UID: "+profile.uid);
        console.log("  Name: "+profile.displayName);
        console.log("  Email: "+profile.email);
        console.log("  Photo URL: "+profile.photoURL);
        loginInfo = profile;

        var username;
        if(loginInfo.displayName){
          username = loginInfo.displayName;
        }else{
          username = loginInfo.email;
        }
        edit_dbRef = firebase.database().ref('/user')
        chatroom_dbRef = firebase.database().ref('/chatroom');

         // Add a callback that is triggered for each chat message.

    chatroom_dbRef.limitToLast(10).on('child_added', function (snapshot) {
      //GET DATA
      var data = snapshot.val();
      var username = data.name || "anonymous";
      var message = data.text;

      //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
      var $messageElement = $("<li>");
      var $nameElement = $("<strong class='example-chat-username'></strong>");
      $nameElement.text(username);
      $messageElement.text(message).prepend($nameElement);

      //ADD MESSAGE
      $messageList.append($messageElement)

      //SCROLL TO BOTTOM OF MESSAGE LIST
      $messageList[0].scrollTop = $messageList[0].scrollHeight;
    });



        loginState = true;
        $nameDisplay.html('You are now '+ username);
      });
    } else {
      $loginPage.css('display','block');
      //$chatRoom.css('display','none');
      console.log("not logged in");
    }
  });

  // Signout
  $btnSignOut.click(function(){
    firebase.auth().signOut();
    loginInfo = {};
    $loginPage.css('display','block');
    //$chatroom.css('display','none');
    $signInfo.html('not logged in');
  });


  //----Profile Edit----
  //
  








  //----chatroom----

  //var dbRef = firebase.database().ref('/chatroom');
  // REGISTER DOM ELEMENTS
  
  var $messageField = $('#messageInput');
  var $nameField = $('#nameInput');
  var $messageList = $('#example-messages');

  // LISTEN FOR KEYPRESS EVENT
  $messageField.keypress(function (e) {
    if (e.keyCode == 13) {
      
      //FIELD VALUES
      var username;
      if(loginInfo.displayName){
        username = loginInfo.displayName;
      }else{
        username = loginInfo.email;
      }
      var message = $messageField.val();
      console.log(username);
      console.log(message);

      //SAVE DATA TO FIREBASE AND EMPTY FIELD
      chatroom_dbRef.push({name:username, text:message});
      $messageField.val('');
    }
  });

 
  
});