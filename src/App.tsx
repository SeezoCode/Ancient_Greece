import React from 'react';
import './App.css';
import firebase from "firebase/app";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import {PhilosophyCardView} from './philosophy/philosophy_detail'
import {PhilosophyCards} from './philosophy/philosophy'
import {LandingPage} from './landing_page/landing_page'

import firebaseConfig from "./fireconfig";
import {HistoryTab} from "./history/history";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
      .functions('europe-west1')
} else {
  firebase.app()
}





function App() {
    return (
        <div>
            <Router>
                <NavBar />
                <Switch>
                    <Route path="/ancient_greece" children={<LandingPage />} />
                    <Route path="/history" children={<HistoryTab />} />
                    {/*<Route path="/politics_and_society" children={<GetComments />} />*/}
                    <Route exact path="/philosophy" children={<PhilosophyCards coll='people' />} />
                    <Route path="/philosophy/:philosopher" children={<PhilosophyCardView />} />
                </Switch>
            </Router>
        </div>
    );
}








function NavBar() {
    return (
        <div className='NavBar'>
            <div className='navbarLinks'>
                <Link className='navbarLink' to="/ancient_greece">Ancient Greece</Link>
                <Link className='navbarLink' to="/history">History</Link>
                <Link className='navbarLink' to="/politics_and_society">Politics and Society</Link>
                <Link className='navbarLink' to="/philosophy">Philosophy</Link>
            </div>
        </div>
    )
}





export default App;
