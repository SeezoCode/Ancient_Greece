import {Link, useLocation} from "react-router-dom";
import {useDocument} from "react-firebase-hooks/firestore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleLeft} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {PhilosophyCards, PhilosophyCard} from './philosophy'

import Loading from "../loading/Loading";

import firebase from "firebase/app";
import "firebase/firestore";

const firestore = firebase.firestore()

export function PhilosophyCardView(props: {language: string}) {
    const location = useLocation()
    const pathName = location.pathname.split('/')[2]
    const [value, loading, error] = useDocument(firestore.doc(`people/${pathName}`))
    let data = value ? value.data() : undefined
    return (
        <div className='navbarLinks philosophyCardSingleDiv'>
            <h1 className='PhilosophyText navbarLinks'> </h1>
            <Link to={'/philosophy'} className='navbarLinks' style={{color: 'black'}} > <br />
                <FontAwesomeIcon icon={faChevronCircleLeft} className='navbarLink' /> Back</Link>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <Loading />}
            {data && <PhilosophyCard resize={false}
                                     img={data.img}
                                     name={data.nameTrans[props.language] === data.name ? data.name : (data.nameTrans[props.language] + ' (' + data.name + ')') ?? data.name}
                                     description={data.allTrans[props.language] ?? data.description}
                                     reputation={data.reputation}
                                     pos={0}
                                     id={value?.id}/>}
            <hr style={{marginTop: '40px'}}/>
            <PhilosophyCards coll={`people/${pathName}/details`} language={props.language} />
        </div>
    );
}