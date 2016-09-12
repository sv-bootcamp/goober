import React from 'react';
import Code from 'code';
import Lab from 'lab';
import { shallow } from 'enzyme';
import CardList from '../../../shared/components/CardList';

const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;

suite('CardList Component', () => {
  test('.. does not throw error without props', (done) => {
    const wrapper = shallow(<CardList />);
    expect(wrapper).to.exist();
    done();
  });
});
