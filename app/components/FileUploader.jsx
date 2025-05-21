import React from 'react';
import autobind from 'autobind-decorator';

import styles from '../styles/components/file-uploader';

class FileUploader extends React.Component {
  state = {
    error: null
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    return (
      <div className={styles.wrapper}>
        <input 
          key="input" 
          className={styles.input} 
          type="file" 
          accept=".json"
          onChange={(e) => this._handleFileChange(e)} 
        />
        {children}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }

  @autobind
  _handleFileChange(e) {
    e.preventDefault();
    const { onFinish } = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];

    // Validate file type
    if (!file.name.endsWith('.json')) {
      this.setState({ error: 'Please select a JSON file' });
      return;
    }

    reader.onloadend = () => {
      try {
        const uri = reader.result;
        const decoded = JSON.parse(uri);
        console.log('done reading');
        this.setState({ error: null });
        onFinish(decoded);
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        this.setState({ error: 'Invalid JSON file. Please ensure the file contains valid JSON data.' });
      }
    }

    reader.onerror = () => {
      this.setState({ error: 'Error reading file' });
    }

    reader.readAsText(file);
    console.log('end of code');
  }
}

export default FileUploader;