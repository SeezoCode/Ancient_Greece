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
    const [language, setLanguage] = React.useState('en')
    return (
        <div>
            <Router>
                <NavBar language={language} setLanguage={setLanguage} />
                <Switch>
                    <Route path="/ancient_greece" children={<LandingPage language={language} />} />
                    <Route path="/history" children={<HistoryTab language={language} />} />
                    {/*<Route path="/politics_and_society" children={<GetComments />} />*/}
                    <Route exact path="/philosophy" children={<PhilosophyCards coll='people' language={language} />} />
                    <Route path="/philosophy/:philosopher" children={<PhilosophyCardView  language={language} />} />
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
                <Link className='navbarLink' to="/ancient_greece">Ancient Greece</Link>
                <Link className='navbarLink' to="/history">History</Link>
                <Link className='navbarLink' to="/politics_and_society">Politics and Society</Link>
                <Link className='navbarLink' to="/philosophy">Philosophy</Link>

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
