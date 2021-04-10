import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onCall(async (data, context) => {
  return handle(data, context, 1);
});

export const downvote = functions.https.onCall(async (data, context) => {
  return handle(data, context, -1);
});

// eslint-disable-next-line require-jsdoc
async function handle(data: any, context: any, val: number) {
  const link = `people/${data.name}`;
  const docRef = admin.firestore().doc(link);
  const docSnapshot = await docRef.get();
  if (docSnapshot.exists) {
    const data = docSnapshot.data();
    if (data) {
      const newVal = data.reputation + val;
      const document = Object.assign(data, {reputation: newVal});
      await docRef.set(document);
      console.log(newVal);
      return newVal;
    }
  }
}
