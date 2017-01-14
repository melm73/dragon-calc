import React from 'react';
import { shallow, mount } from 'enzyme';
import DragonBreedingCalculator from '../dragon-breeding-calculator.jsx';
import DragonPicker from '../dragon-picker';
import DragonTable from '../dragon-table';
import dragons from '../../data/dragons';
import * as breedingCalculator from '../../actions/breeding-calculator';

describe('DragonBreedingCalculator', () => {
  describe('render', () => {
    it('renders a title, two dragon pickers and a table', () => {
      const dragonCalc = shallow(<DragonBreedingCalculator />);

      const heading = dragonCalc.childAt(0);
      expect(heading.type()).toEqual('h1');
      expect(heading.text()).toEqual('Dragonvale World Breeding Calculator');

      const pickers = dragonCalc.childAt(1);
      const leftPicker = pickers.childAt(0).childAt(0);
      expect(leftPicker.type()).toEqual(DragonPicker);
      expect(leftPicker.prop('dragons')).toEqual(dragons);

      const rightPicker = pickers.childAt(1).childAt(0);
      expect(rightPicker.type()).toEqual(DragonPicker);
      expect(rightPicker.prop('dragons')).toEqual(dragons);

      const dragonTable = dragonCalc.childAt(2);
      expect(dragonTable.type()).toEqual(DragonTable);
    });

    it('initial value of left and right dragons is null', () => {
      const dragonCalc = shallow(<DragonBreedingCalculator />);

      expect(dragonCalc.state().leftDragon).toEqual(null);
      expect(dragonCalc.state().rightDragon).toEqual(null);

      const leftPicker = dragonCalc.find(DragonPicker).at(0);
      expect(leftPicker.prop('value')).toEqual(null);

      const rightPicker = dragonCalc.find(DragonPicker).at(1);
      expect(rightPicker.prop('value')).toEqual(null);
    });

    it('initial breeding result is an empty array', () => {
      const dragonCalc = shallow(<DragonBreedingCalculator />);
      expect(dragonCalc.state().breedingResult).toEqual([]);

      const dragonTable = dragonCalc.childAt(2);
      expect(dragonTable.prop('dragons')).toEqual([]);
    });
  });

  describe('events', () => {
    beforeEach(() => {
      const breedingResult = [{ name: 'dragon one', elements: ['air'], breedingTime: '1d' }];
      spyOn(breedingCalculator, 'default').and.returnValue(breedingResult);
    });

    it('on change right dragon, sets rightDragon state', () => {
      const dragonCalc = mount(<DragonBreedingCalculator />);
      const rightPicker = dragonCalc.find(DragonPicker).at(1);

      rightPicker.prop('onChange')(5);

      expect(dragonCalc.state().rightDragon).toEqual(5);
      expect(rightPicker.prop('value')).toEqual(5);

      expect(breedingCalculator.default).not.toHaveBeenCalled();
    });

    it('on change right dragon, sets rightDragon state', () => {
      const dragonCalc = mount(<DragonBreedingCalculator />);
      const leftPicker = dragonCalc.find(DragonPicker).at(0);

      leftPicker.prop('onChange')(4);

      expect(dragonCalc.state().leftDragon).toEqual(4);
      expect(leftPicker.prop('value')).toEqual(4);

      expect(breedingCalculator.default).not.toHaveBeenCalled();
    });

    it('on change right and left dragons, sets state and calls calculator', () => {
      const dragonCalc = mount(<DragonBreedingCalculator />);
      const leftPicker = dragonCalc.find(DragonPicker).at(0);
      const rightPicker = dragonCalc.find(DragonPicker).at(1);

      leftPicker.prop('onChange')(4);
      rightPicker.prop('onChange')(5);

      expect(dragonCalc.state().leftDragon).toEqual(4);
      expect(leftPicker.prop('value')).toEqual(4);
      expect(dragonCalc.state().rightDragon).toEqual(5);
      expect(rightPicker.prop('value')).toEqual(5);

      expect(breedingCalculator.default).toHaveBeenCalledWith(4, 5);
      expect(dragonCalc.state().breedingResult).toEqual(
        [{ name: 'dragon one', elements: ['air'], breedingTime: '1d' }]
      );
    });
  });
});
