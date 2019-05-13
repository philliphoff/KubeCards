import React from 'react';
import ReactDOM from 'react-dom';
import KubeCardsApp from './KubeCardsApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<KubeCardsApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
