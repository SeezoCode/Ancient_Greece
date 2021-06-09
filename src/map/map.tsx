import React from "react";
//@ts-ignore
import Greece from "@svg-maps/greece";
import { SVGMap } from "react-svg-map";

import {useCollectionOnce, useDocumentOnce} from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import {LandingElem} from "../landing_page/landing_page";
import {Link} from "react-router-dom";

const firestore = firebase.firestore()
const anal = firebase.analytics()


export function Map(props: any) {
    let [currentDistrict, setCurrentDistrict] = React.useState('notSelected')
    // React.useEffect(() => {
    //     firestore.collection('map').doc(currentDistrict).set({
    //         name: currentDistrict,
    //         description: [''],
    //     }).then((e) => console.log(e))
    // })
    anal.logEvent(currentDistrict)

    const [snapshot,] = useDocumentOnce(firestore.collection('map').doc(currentDistrict))
    const [peopleSnapshot,] = useCollectionOnce(firestore.collection('people')
        .where('from', '==', currentDistrict))
    let data;
    if (snapshot) data = snapshot.data()
    let peopleData
    if (peopleSnapshot) peopleData = peopleSnapshot.docs.map((e, i) => {
        const data = e.data()
        return <div className='mapPerson mapAnimateInSlow' key={i}>
            <LandingElem
                img={data.img}
                name={data.name}
                sd={data.sd}
                to={data.to}
                height='220px'
            />
            </div>
    })
    return (
        <div>
            <h1 className='PhilosophyText navbarLinks' id='historyTabMargin'> </h1>
            <div className='mapCol'>
                <div>
                    <SVGMap map={Greece} className='svg-map' onLocationClick={(e) => {
                        setCurrentDistrict(e.target.id)
                    }} />
                    <div className='mapText'>
                        <p><b>Note:</b> Districts are from today's greece. Before, lands were held by city-states </p>
                        <p><Link className='navbarLink' to="/map/3D">Bonus Map</Link></p>
                    </div>
                </div>
                <div className='mapText mapAnimateIn'>
                    {data && <div>
                        <h2 className='mapAnimateIn'>{data.name}</h2>
                        {data.description.map((e: string, i: number) => {
                            return <p className='mapAnimateIn' key={i}>{e}</p>
                        })}
                        <div className='mapPeopleDiv'>
                            {peopleSnapshot && peopleData}
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

