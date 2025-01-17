import React, { useState } from 'react';
import '../public/styles/style.css';
import '../public/styles/styleNew.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppContainer from '../containers/AppContainer';
import { initialState, stateContext } from '../context/context';
// import { Context } from '../interfaces/InterfacesNew';

// Intermediary component to wrap main App component with higher order provider components
export const App = (): JSX.Element => {
  const [context, setContext] = useState(initialState);
  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <header
          style={{ height: '40px', width: '100%', backgroundColor: 'white' }}
        >
          ReacType
        </header>
        <stateContext.Provider value={[context, setContext]}>
          <AppContainer />
        </stateContext.Provider>
      </DndProvider>
    </div>
  );
};

export default App;
