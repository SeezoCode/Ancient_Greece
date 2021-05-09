import {Link, useLocation} from "react-router-dom";
import {useDocument} from "react-firebase-hooks/firestore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleLeft} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import firebase from "firebase";
import {PhilosophyCards, PhilosophyCard} from './philosophy'

import firebaseConfig from "../fireconfig";
import Loading from "../loading/Loading";

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
    let data = value ? value.data() : undefined
    return (
        <div className='navbarLinks philosophyCardSingleDiv'>
            <h1 className='PhilosophyText navbarLinks'> </h1>
            <Link to={'/philosophy'} className='navbarLinks' style={{color: 'black'}} > <br />
                <FontAwesomeIcon icon={faChevronCircleLeft} /> Back</Link>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <Loading />}
            {data && <PhilosophyCard resize={false} img={data.img} name={data.name}
                                     description={data.description} reputation={data.reputation} pos={0} />}
            <hr style={{marginTop: '40px'}}/>
            <PhilosophyCards coll={`people/${pathName}/details`} />
        </div>
    );
}