import React from 'react';
import autobind from 'autobind-decorator';
import * as THREE from 'three';
import { STEPLoader } from 'three-step-loader';
import { customBricks } from '../utils/constants';

import styles from '../styles/components/file-uploader';

class FileUploader extends React.Component {
  state = {}

  render() {
    const { children } = this.props;
    return (
      <div className={styles.wrapper}>
        <input 
          key="input" 
          className={styles.input} 
          type="file" 
          accept=".stp,.step,.json"
          onChange={(e) => this._handleFileChange(e)} 
        />
        {children}
      </div>
    );
  }

  @autobind
  async _handleFileChange(e) {
    e.preventDefault();
    const { onFinish } = this.props;
    const file = e.target.files[0];
    
    if (file.name.toLowerCase().endsWith('.stp') || file.name.toLowerCase().endsWith('.step')) {
      const loader = new STEPLoader();
      try {
        const geometry = await loader.loadAsync(file);
        
        // Calculate dimensions based on bounding box
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        const dimensions = {
          x: Math.ceil((box.max.x - box.min.x) / base),
          z: Math.ceil((box.max.z - box.min.z) / base)
        };
        
        // Add to custom bricks
        customBricks.push({
          ...dimensions,
          geometry: geometry,
          name: file.name.split('.')[0]
        });
        
        onFinish({ success: true, message: 'STEP file imported successfully' });
      } catch (err) {
        onFinish({ success: false, message: 'Failed to import STEP file' });
      }
    } else {
      // Handle JSON scene files
      const reader = new FileReader();
      reader.onloadend = () => {
        const uri = reader.result;
        const decoded = JSON.parse(uri);
        onFinish(decoded);
      }
      reader.readAsText(file);
    }
  }
}

export default FileUploader;