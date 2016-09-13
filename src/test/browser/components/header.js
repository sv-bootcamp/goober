import React from 'react';
import Code from 'code';
import Lab from 'lab';
import { shallow } from 'enzyme';
import Header from '../../../shared/components/header';

const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;

suite('Header Component', () => {
  test('check header text', (done) => {
    const wrapper = shallow(<Header/>);
    expect(wrapper.text()).to.equal('asdf');
    done();
  });
});
