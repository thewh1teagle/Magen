importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyBrzMpyHf3eE0Jf2Gy9pVbQL0elbsHjK_Y",
    authDomain: "oref-bfe4f.firebaseapp.com",
    projectId: "oref-bfe4f",
    storageBucket: "oref-bfe4f.appspot.com",
    messagingSenderId: "560908453571",
    appId: "1:560908453571:web:b3b766a2a45430b51a8476",
    measurementId: "G-K1LVX99ZNV"
});

const messaging = firebase.messaging();

// Optional:
messaging.onBackgroundMessage(async (message) => {
  console.log("onBackgroundMessage", message);
  const options = {
    body: "hello world",
  };
  // self.registration.showNotification("received notification", options)
  // await new Promise(resolve => setTimeout(resolve, 1000))
  // const notifications = self.registration.getNotifications()
  // notifications.map(n => n.close())
});
