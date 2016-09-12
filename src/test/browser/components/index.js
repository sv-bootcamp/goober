import React from 'react';
import Code from 'code';
import Lab from 'lab';
import { shallow } from 'enzyme';
import Index from '../../../shared/components/index';

const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;

suite('Index Component', () => {
  test('.. does not throw error without props', (done) => {
    const wrapper = shallow(<Index />);
    expect(wrapper).to.exist();
    done();
  });
});
