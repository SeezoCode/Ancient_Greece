
// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;
const admin = require('firebase-admin');

const serviceAccount = require('./roman-empire-power-f30026af6ff4.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// Creates a client
const translate = new Translate();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const text = 'The text to translate, e.g. Hello, world!';
// const target = 'cs';

const targets = ['cs', 'de', 'sk', 'pl', 'zh', 'fr', 'el', 'ru', 'es', 'ko']
// const targets = ['cs', 'de', 'sk']

// async function translateText() {
//     // let doc = await db.collection('people').doc('Aristotle').get()
//     // const data = doc.data()
//     // console.log(data)
// }

async function translateTextPhilosophy() {
    let collection = await db.collection('people').where('reputation', '<', Infinity).get()
    // console.log(data)
    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    collection.docs.map(async (doc) => {
        let detatils = await db.collection('people').doc(doc.id).collection('details').get()
        detatils.docs.map(async (doc2) => {
            const data = doc2.data()
            const allTrans = {};
            allTrans.en = data.description
            for (const target of targets) {
                let [translations] = await translate.translate(data.description, target);
                allTrans[target] = translations
            }
            await db.collection('people').doc(doc.id).collection('details').doc(doc2.id).update({allTrans})
        })
        const data = doc.data()
        const allTrans = {};
        allTrans.en = data.description
        for (const target of targets) {
            let [translations] = await translate.translate(data.description, target);
            allTrans[target] = translations
        }
        // console.log(allTrans)
        await db.collection('people').doc(doc.id).update({allTrans})
    })
}


async function translateTextPhilosophySd() {
    let collection = await db.collection('people').get()
    collection.docs.map(async (doc) => {
        const data = doc.data()
        const sdTrans = {};
        sdTrans.en = data.sd
        for (const target of targets) {
            let [translations] = await translate.translate(data.sd, target);
            sdTrans[target] = translations
        }
        // console.log(allTrans)
        await db.collection('people').doc(doc.id).update({sdTrans})
    })
}
// translateTextPhilosophySd()


async function translatePhilosophyNames() {
    let collection = await db.collection('people').get()
    collection.docs.map(async (doc) => {
        const data = doc.data()
        const nameTrans = {};
        nameTrans.en = data.name
        for (const target of targets) {
            let [translations] = await translate.translate(data.name, target);
            nameTrans[target] = translations
        }
        // console.log(allTrans)
        await db.collection('people').doc(doc.id).update({nameTrans})
    })
}
// translatePhilosophyNames()

async function translatePhilosophyDetailsNames() {
    let collection = await db.collection('people').get()
    collection.docs.map(async (doc) => {
        let collection = await db.collection('people').doc(doc.id).collection('details').get()
        collection.docs.map(async (doc2) => {
            const data = doc2.data()
            const nameTrans = {};
            nameTrans.en = data.name
            for (const target of targets) {
                let [translations] = await translate.translate(data.name, target);
                nameTrans[target] = translations
            }
            // console.log(allTrans)
            await db.collection('people').doc(doc.id).collection('details').doc(doc2.id).update({nameTrans})
        })
    })
}


// translateTextPhilosophy();

async function translateHistory() {
    const document = await db.collection('data').doc('HistorySection').get()
    const data = document.data()
    const allTrans = {};
    allTrans.en = data.data
    for (const target of targets) {
        let [translations] = await translate.translate(data.data, target);
        allTrans[target] = translations
    }
    await db.collection('data').doc('HistorySection').update(allTrans)
}
// translateHistory()


async function translateLandingText() {
    const document = await db.collection('data').doc('landingText').get()
    const data = document.data()
    const nameTrans = {};
    const textTrans = {};
    nameTrans.en = data.name
    textTrans.en = data.text
    for (const target of targets) {
        let [translations] = await translate.translate(data.name, target);
        let [translationsText] = await translate.translate(data.text, target);
        nameTrans[target] = translations
        textTrans[target] = translationsText
    }
    await db.collection('data').doc('landingText').update({nameTrans, textTrans})
}

// translateLandingText()




