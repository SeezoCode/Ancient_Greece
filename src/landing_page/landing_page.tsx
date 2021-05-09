import {useCollectionOnce} from "react-firebase-hooks/firestore";
import firebase from "firebase";
import {useHistory} from "react-router-dom";
import React from "react";

import firebaseConfig from "../fireconfig";
import Loading from "../loading/Loading";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
        .functions('europe-west1')
} else {
    firebase.app()
}

export function LandingPage() {
    const [snapshot, loading, error] = useCollectionOnce(firebase.firestore().collection('people').orderBy('reputation', 'desc'));
    if (snapshot) {
        let arr: Array<Array<any>> = [[], [], []]
        const elems = snapshot.docs.map((doc, i) => {
            const data = doc.data()
            return <LandingElem key={i} img={data.img} name={data.name} sd={data.sd} to={data.to} />
        })

        elems.forEach((elem, i) => {
            arr[i % 3].push(elem)
        })
        return <div className='landingScreen'>
            <div className='landingScreenText landingElements'>
                <h1>Ancient Greece</h1>
                <p id='landingInfo'>Ancient Greece (Greek: Ἑλλάς, romanized: Hellás) was a civilization belonging to a period of Greek
                    history
                    from the Greek Dark Ages of the 12th–9th centuries BC to the end of antiquity (c. AD 600).</p>
            </div>
            <div className="landingElements">
                <div>{arr[0]}</div>
                <div>{arr[1]}</div>
                <div>{arr[2]}</div>
            </div>
        </div>
    }
    return (
        <div>
            {error && <p>{JSON.stringify(error)}</p>}
            {loading && <div><br /><br /><br /> <Loading /> </div>}
            {snapshot && <p>Loaded</p>}
        </div>
    )
}


function LandingElem(props: any) {
    const history = useHistory();

    return (
        <div className="landingElem" onClick={() => {history.push(props.to)}}>
            <img src={props.img} alt='' className="landingImages"/>
            <div className="landingText">
                <h3>{props.name}</h3>
                <p>{props.sd}</p>
                {/*<button className="btn btn-outline-dark">See more</button>*/}
            </div>
        </div>
    )
}