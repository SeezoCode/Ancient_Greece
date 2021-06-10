import React from "react";
import {useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import {useDocumentOnce} from "react-firebase-hooks/firestore";

import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../loading/Loading";

const db = firebase.firestore()


export function Extras() {
    const history = useHistory()
    return (
        <div>
            <h1 className='PhilosophyText navbarLinks'> </h1>

            <div className='philosophyCard' onClick={() => {
                history.push("/extras/wars_of_ages")}
            } >
                <img alt='' src='wars_of_ages.png' className="philosophyImg"/>
                <div className="philosophyCardText">
                    <FontAwesomeIcon className='faExternalLinkAlt' icon={faExternalLinkAlt} />
                    <h3 className='philosophyCardName'>Wars of Ages Online!</h3>
                    <hr />
                    <p>Play the ultimate web game that's 100% true to the reality of the ancient world</p>
                </div>
            </div>

            <div className="marginBottomDiv"> </div>
        </div>
    )
}


export function WarsOfAges() {
    const [address, loading, ] = useDocumentOnce(db.collection('data').doc('WarsOfAges'))
    return (
        <div>
            {address && <div>
                <div className='extrasWarsOfAges'>
                    <div className='extrasWarsOfAges'>
                        <iframe style={{border: 'none'}} src={address.data()?.address} />
                    </div>
                </div>
            </div>}
            {loading &&
                <div>
                    <h1 className='PhilosophyText navbarLinks'> </h1>
                    <Loading />
                </div>
            }
        </div>
    )
}