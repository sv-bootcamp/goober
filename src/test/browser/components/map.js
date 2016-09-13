import React from 'react';
import Code from 'code';
import Lab from 'lab';
import { shallow } from 'enzyme';
import Marker from '../../../shared/components/Marker';

const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;


suite('Map Component', () => {
  test('check marker exist', (done) => {
    const wrapper = shallow(<Marker key="test" text="test" />);
    expect(wrapper).to.exist();
    done();
  });

  test('check content on marker', (done) => {
    const wrapper = shallow(<Marker key="test" text="test" />);
    expect(wrapper.text()).to.equal('test');
    done();
  });
});
