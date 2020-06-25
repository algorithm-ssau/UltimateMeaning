import React from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'

import {Testing, Intro} from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <Redirect exact from="/" to="/intro"/>
            <Switch>
                <Route path="/intro" exact component={Intro}/>
                <Route path="/testing" exact component={Testing}/>
            </Switch>
        </Router>
    )
}

export default App
