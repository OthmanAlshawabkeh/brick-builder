import React from 'react';
import { saveAs } from 'file-saver';
import autobind from 'autobind-decorator';

import FileUploader from './FileUploader';
import Brick from 'components/engine/Brick';
import Message from './Message';

import styles from '../styles/components/sidebar';

class Sidebar extends React.Component {
  state = {
    error: null
  };

  render() {
    const { utilsOpen, resetScene } = this.props;
    const { error } = this.state;
    
    return (
      <div className={utilsOpen ? styles.visible : styles.sidebar}>
        <div className={styles.content}>
          {error && (
            <Message type="error" onClose={() => this.setState({ error: null })}>
              {error}
            </Message>
          )}
          <div className={styles.row} onClick={resetScene}>
            <div className={styles.text}>
              <i className="ion-trash-a" />
              <span>Reset scene</span>
            </div>
          </div>
          <div className={styles.row} onClick={this._exportFile}>
            <div className={styles.text}>
              <i className="ion-log-out" />
              <span>Export scene</span>
            </div>
          </div>
          <div className={styles.row}>
            <FileUploader onFinish={this._importFile}>
              <div className={styles.text}>
                <i className="ion-log-in" />
                <span>Import scene</span>
              </div>
            </FileUploader>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  _exportFile() {
    const { objects } = this.props;
    const fileName = 'scene.json';
    const simplified = objects.map((o) => ({
      intersect: o._intersect,
      color: o._color,
      dimensions: o._dimensions,
      rotation: o._rotation,
      translation: o._translation,
    }));
    var fileToSave = new Blob([JSON.stringify(simplified)], {
      type: 'application/json',
      name: fileName,
    });
    saveAs(fileToSave, fileName);
  }

  @autobind
  _importFile(objects) {
    try {
      const { importScene } = this.props;
      
      // Clear any previous errors
      this.setState({ error: null });
      
      // Validate the imported data structure
      if (!Array.isArray(objects)) {
        throw new Error('Invalid scene format: The imported file must contain an array of objects');
      }

      const bricks = objects.map((o, index) => {
        // Validate required properties
        if (!o.intersect || !o.color || !o.dimensions || !o.rotation || !o.translation) {
          throw new Error(`Invalid brick data at position ${index + 1}: Missing required properties`);
        }
        return new Brick(o.intersect, o.color, o.dimensions, o.rotation, o.translation);
      });

      importScene(bricks);
    } catch (error) {
      console.error('Failed to import scene:', error);
      this.setState({ error: error.message });
    }
  }
}

export default Sidebar;