import React from 'react';
import Code from 'code';
import Lab from 'lab';
const lab = exports.lab = Lab.script();

import { shallow } from 'enzyme';

const suite = lab.suite;
const test = lab.test;
const expect = Code.expect;

import Marker from '../../../shared/components/Marker';

suite('Map Component', () => {
  test('check marker exist', (done) => {
    const wrapper = shallow( <Marker key="test" text="test" /> );
    expect(wrapper).to.exist();
    done();
  });

  test('check content on marker', (done) => {
  	const wrapper = shallow( <Marker key="test" text="test" /> );
  	expect(wrapper.text()).to.equal("test");
  	done();
  });
});
