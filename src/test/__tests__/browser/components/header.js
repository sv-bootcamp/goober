import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Header from '../../../../shared/components/header';

it('Check text message in the header', () => {
  const checkText = TestUtils.renderIntoDocument(
    <Header/>
  );

  const checkTextNode = ReactDOM.findDOMNode(checkText);

  expect(checkTextNode.textContent).toEqual('WHAT A GREAT HEADER');
});

it('Check CSS style', () => {
  const checkStyle = TestUtils.renderIntoDocument(
    <Header/>
  );

  const checkStyleNode = ReactDOM.findDOMNode(checkStyle);

  expect(checkStyleNode.style._values).toEqual(
    {
      'color': 'yellow',
      'background-color': 'blue',
      'height': '200px',
      'width': '100%'
    }
  );
});

