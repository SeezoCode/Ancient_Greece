import {useCollectionOnce, useDocumentOnce} from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import "firebase/firestore";
import {useHistory} from "react-router-dom";
import React from "react";

import Loading from "../loading/Loading";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";

const db = firebase.firestore()

export function LandingPage(props: { language: string }) {
    const [snapshot, loading, error] = useCollectionOnce(db.collection('people').orderBy('reputation', 'desc'));
    const [topSnapshot, , ] = useDocumentOnce(db.collection('data').doc('landingText'))

    if (snapshot) {
        let arr: Array<Array<any>> = [[], [], []]
        const elems = snapshot.docs.map((doc, i) => {
            const data = doc.data()
            return <LandingElem key={i}
                                img={data.img}
                                name={data.nameTrans[props.language] ? (data.nameTrans[props.language] === data.name ? data.name : (data.nameTrans[props.language]))
                                    : data.name}
                                sd={data.sdTrans[props.language] ?? data.sd}
                                to={data.to} />
        })
        elems.forEach((elem, i) => {
            arr[i % 3].push(elem)
        })
        return <div className='landingScreen'>
            <div className='landingScreenText landingElements'>
                <h1>{topSnapshot?.data()?.nameTrans[props.language]}</h1>
                <p id='landingInfo'>{topSnapshot?.data()?.textTrans[props.language]}</p>
            </div>
            <div className="landingElements">
                <div>{arr[0]}</div>
                <div>{arr[1]}</div>
                <div>{arr[2]}</div>
            </div>
            <div className="marginBottomDiv"> </div>
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


export function LandingElem(props: any) {
    const history = useHistory();

    return (
        <div className="landingElem" onClick={() => {
            if (props.to && (props.to.startsWith('https://') || props.to.startsWith('http://'))) {
                const a = document.createElement('a')
                a.href = props.to
                a.target = 'blank'
                a.click()
            }
            else history.push(props.to)

        }}>
            <img src={props.img} alt='' className="landingImages" height={props.height ? props.height : 'auto'}/>
            <div className="landingText">
                <h3>{props.name} {props.to && <FontAwesomeIcon className='faExternalLinkAlt2' icon={faExternalLinkAlt} />}</h3>
                <p>{props?.sd}</p>
                {/*<button className="btn btn-outline-dark">See more</button>*/}
            </div>
        </div>
    )
}