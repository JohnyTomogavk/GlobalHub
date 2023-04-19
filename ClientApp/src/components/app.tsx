import '../styles/main.scss';
import React, { useState } from 'react';

function App() :React.FC {
  const [state, setState] = useState(0);
  setState(state + 1);

  return <h1 className="h1">{state}</h1>;
}

export default App;
