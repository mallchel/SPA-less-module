import SelectSplit from './Split';

class SelectAxis extends SelectSplit {
  getDefaultValue() {
    const {availableValues} = this.state;

    if (!availableValues.length) {
      return null;
    }

    return availableValues[0];
  }
}

export default SelectAxis;
