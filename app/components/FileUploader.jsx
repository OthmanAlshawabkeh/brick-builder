import React from 'react';
import autobind from 'autobind-decorator';
import * as THREE from 'three';
import StepParser from 'three-step-parser';
import { customBricks } from '../utils/constants';
import { base } from '../utils/constants';

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
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const parser = new StepParser();
            const geometry = await parser.parse(event.target.result);
            
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
            console.error('Failed to parse STEP file:', err);
            onFinish({ success: false, message: 'Failed to parse STEP file' });
          }
        };
        reader.readAsText(file);
      } catch (err) {
        console.error('Failed to read file:', err);
        onFinish({ success: false, message: 'Failed to read file' });
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