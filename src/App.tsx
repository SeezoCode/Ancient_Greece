import React, {lazy, Suspense} from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/analytics";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import {PhilosophyCardView} from './philosophy/philosophy_detail'
import {PhilosophyCards} from './philosophy/philosophy'
import {LandingPage} from './landing_page/landing_page'
import {Map} from './map/map'

import firebaseConfig from "./fireconfig";
import {HistoryTab} from "./history/history";
import Loading from "./loading/Loading";
// import {Extras, WarsOfAges} from "./extras/extras";

// @ts-ignore
const Map3D = lazy(() => import('./map/bonus/map3D'))

const renderLoader = () => <div>
        <h1 className='PhilosophyText navbarLinks' id='historyTabMargin'> </h1>
        <Loading />
    </div>;
const DetailsComponent = () => (
    <Suspense fallback={renderLoader()}>
        <Map3D />
    </Suspense>
)

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
      .functions('europe-west1')
} else {
  firebase.app()
}

const anal = firebase.analytics()


function App() {
    const [language, setLanguage] = React.useState('en')
    anal.logEvent(window.location.pathname)
    return (
        <div>
            <Router>
                <NavBar language={language} setLanguage={setLanguage} />
                <Switch>
                    <Route exact path="/" children={<LandingPage language={language} />} />
                    <Route path="/history" children={<HistoryTab language={language} />} />
                    <Route path="/map" children={<Map />} />
                    <Route path="/map3D" children={<DetailsComponent />} />
                    <Route exact path="/philosophy" children={<PhilosophyCards coll='people' language={language} />} />
                    <Route path="/philosophy/:philosopher" children={<PhilosophyCardView  language={language} />} />
                    {/*<Route exact path="/extras" children={<Extras />} />*/}
                    {/*<Route exact path="/extras/wars_of_ages" children={<WarsOfAges />} />*/}
                </Switch>
            </Router>
        </div>
    );
}


function NavBar(props: { language: string; setLanguage: any}) {
    const languages = ['en', 'cs', 'de', 'sk', 'pl', 'zh', 'fr', 'el', 'ru', 'es', 'ko']
    return (
        <div className='NavBar'>
            <div className='navbarLinks'>
                <Link className='navbarLink' to="/">Ancient Greece</Link>
                <Link className='navbarLink' to="/history">History</Link>
                <Link className='navbarLink' to="/map">Map</Link>
                <Link className='navbarLink' to="/philosophy">Philosophy</Link>
                {/*<Link className='navbarLink' to="/extras">Extras</Link>*/}

                <form id='czechButton'>
                    <label>Language: </label>
                    <select onChange={(e) => props.setLanguage(e.target.value)} id='lanInput'>
                        {languages.map((lan, i) => {
                            return <option key={i} value={lan}>{lan === 'en' ? 'en (recommended)' : lan}</option>})
                        }
                    </select>
                </form>
            </div>
        </div>
    )
}


export default App;
