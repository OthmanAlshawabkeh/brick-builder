import React from 'react';
import If from 'if-only';
import isEqual from 'lodash/isEqual';

import { displayNameFromDimensions, getBrickIconFromDimensions } from 'utils';
import { bricks, addCustomBrick } from 'utils/constants';

import styles from 'styles/components/brick-picker';

class BrickPicker extends React.Component {
  state = {
    open: false,
    showCustomForm: false,
    customX: '',
    customZ: ''
  }

  constructor(props) {
    super(props);
    this._togglePicker = this._togglePicker.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleCustomSubmit = this._handleCustomSubmit.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this._handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleClickOutside);
  }

  render() {
    const { selectedSize, handleSetBrick } = this.props;
    const { open, showCustomForm, customX, customZ } = this.state;
    return (
      <div className={styles.brickPicker}>
        <div className={styles.brick} onClick={this._togglePicker}>
          <div className={styles.brickIcon}>
            {getBrickIconFromDimensions(selectedSize)}
          </div>
        </div>
        <If cond={open}>
          <div className={styles.picker} ref={(picker) => this.picker = picker}>
            {bricks.map((b, i) => (
              <div key={i} className={styles.brickExample}>
                <div className={isEqual(selectedSize, b) ? styles.selected : styles.brickThumb} onClick={() => handleSetBrick(b)}>
                  {getBrickIconFromDimensions(b)}
                </div>
                <div className={styles.label}>
                  {displayNameFromDimensions(b)}
                </div>
              </div>
            ))}
            <div className={styles.customBrick}>
              <button onClick={() => this.setState({ showCustomForm: !showCustomForm })}>
                + Add Custom
              </button>
              <If cond={showCustomForm}>
                <form onSubmit={this._handleCustomSubmit} className={styles.customForm}>
                  <input 
                    type="number" 
                    placeholder="Width" 
                    value={customX}
                    onChange={(e) => this.setState({ customX: e.target.value })}
                    min="1"
                    required
                  />
                  <input 
                    type="number" 
                    placeholder="Depth" 
                    value={customZ}
                    onChange={(e) => this.setState({ customZ: e.target.value })}
                    min="1"
                    required
                  />
                  <button type="submit">Add</button>
                </form>
              </If>
            </div>
          </div>
        </If>
      </div>
    );
  }

  _togglePicker() {
    this.setState({
      open: !this.state.open,
    });
  }

  _handleClickOutside(event) {
    if (this.picker && !this.picker.contains(event.target)) {
      this.setState({
        open: false,
        showCustomForm: false
      });
    }
  }

  _handleCustomSubmit(e) {
    e.preventDefault();
    const { customX, customZ } = this.state;
    const newBrick = { x: parseInt(customX), z: parseInt(customZ) };
    addCustomBrick(newBrick);
    this.props.handleSetBrick(newBrick);
    this.setState({
      customX: '',
      customZ: '',
      showCustomForm: false
    });
  }
}

export default BrickPicker;