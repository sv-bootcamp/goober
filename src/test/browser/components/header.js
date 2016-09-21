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
  test('.. does not throw error without props', (done) => {
    const wrapper = shallow(<Header/>);
    expect(wrapper).to.exist();
    done();
  });
});
