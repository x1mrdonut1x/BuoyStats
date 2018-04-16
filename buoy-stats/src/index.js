import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/main/App';
import Footer from "./pages/footer/Footer"
import registerServiceWorker from './registerServiceWorker';

const Main = () => (
    [<App key={0}/>,
    <Footer key={1}/>]
);

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
