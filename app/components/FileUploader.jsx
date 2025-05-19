import React from 'react';
import autobind from 'autobind-decorator';
import { parseSTEPFile } from '../utils/step-parser';
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
          accept=".json,.stp,.step"
          onChange={(e) => this._handleFileChange(e)} 
        />
        {children}
      </div>
    );
  }

  @autobind
  _handleFileChange(e) {
    e.preventDefault();
    const { onFinish } = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      const fileContent = reader.result;
      
      if (file.name.endsWith('.json')) {
        // Handle JSON files as before
        const decoded = JSON.parse(fileContent);
        onFinish(decoded);
      } else if (file.name.endsWith('.stp') || file.name.endsWith('.step')) {
        // Handle STEP files
        try {
          const bricks = parseSTEPFile(fileContent);
          onFinish(bricks);
        } catch (error) {
          console.error('Error parsing STEP file:', error);
        }
      }
    };

    if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  }
}

export default FileUploader;