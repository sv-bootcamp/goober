import React from 'react';
import Code from 'code';
import Lab from 'lab';
import Header from '../../../shared/components/header';
const lab = exports.lab = Lab.script();

import { shallow } from 'enzyme';

const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;

suite('Header Component', () => {
  test('Check text message in the header', (done) => {
    const wrapper = shallow( <Header/>);
    expect(wrapper.text()).to.equal('WHAT A GREAT HEADER');
    done();
  });
});

