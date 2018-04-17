import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './pages/main/Main';
import Footer from "./components/footer/Footer"
import registerServiceWorker from './registerServiceWorker';

const App = () => (
    [<Main key={0}/>,
    <Footer key={1}/>]
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
