import * as ReactDOMClient from 'react-dom/client';
import App from "./components/app";

const root = ReactDOMClient.createRoot(document.getElementById('root')!);
root.render(<App/>);
