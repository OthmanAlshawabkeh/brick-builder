import React from 'react';
import { saveAs } from 'file-saver';
import autobind from 'autobind-decorator';

import FileUploader from './FileUploader';
import Brick from 'components/engine/Brick';

import styles from '../styles/components/sidebar';

class Sidebar extends React.Component {
  render() {
    const { utilsOpen, resetScene } = this.props;
    return (
      <div className={utilsOpen ? styles.visible : styles.sidebar}>
        <div className={styles.content}>
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
      
      // Validate the imported data structure
      if (!Array.isArray(objects)) {
        throw new Error('Invalid scene format: Expected an array of objects');
      }

      const bricks = objects.map((o) => {
        // Validate required properties
        if (!o.intersect || !o.color || !o.dimensions || !o.rotation || !o.translation) {
          throw new Error('Invalid brick data: Missing required properties');
        }
        return new Brick(o.intersect, o.color, o.dimensions, o.rotation, o.translation);
      });

      importScene(bricks);
    } catch (error) {
      console.error('Failed to import scene:', error);
      // You might want to show this error to the user through your UI
    }
  }
}

export default Sidebar;