import {Link, useLocation} from "react-router-dom";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleLeft} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import firebase from "firebase";
import {PhilosophyCards, PhilosophyCard} from './philosophy'

import firebaseConfig from "../fireconfig";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
        .functions('europe-west1')
} else {
    firebase.app()
}

const firestore = firebase.firestore()

export function PhilosophyCardView() {
    const location = useLocation()
    const pathName = location.pathname.split('/')[2]
    const [value, loading, error] = useDocument(firestore.doc(`people/${pathName}`))
    const [detailsSnapshot, detailsLoading, detailsError] = useCollection(firestore.collection(`people/${pathName}/details`))
    let data = value ? value.data() : undefined
    let details: JSX.Element[] = []
    if (detailsSnapshot) {
        detailsSnapshot.docs.map((doc, i) => {
            const data1 = doc.data()
            details.push(<PhilosophyCard resize={false} img={data1.img} name={data1.name} id={doc.id} col={`people/${data?.name}/details`}
                                         description={data1.description} reputation={data1.reputation} pos={0} key={i} />)
        })
    }
    return (
        <div className='navbarLinks philosophyCardSingleDiv'>
            <h1 className='PhilosophyText navbarLinks'> </h1>
            <Link to={'/philosophy'} className='navbarLinks' style={{color: 'black'}} > <br />
                <FontAwesomeIcon icon={faChevronCircleLeft} /> Back</Link>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span style={{color: 'gray'}}>Document: Loading...</span>}
            {data && <PhilosophyCard resize={false} img={data.img} name={data.name}
                                     description={data.description} reputation={data.reputation} pos={0} />}
            <hr style={{marginTop: '40px'}}/>
            <PhilosophyCards coll={`people/${pathName}/details`} />
        </div>
    );
}