import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import {Testing} from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/testing" exact component={Testing}/>
            </Switch>
        </Router>
    )
}

export default App
