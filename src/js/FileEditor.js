import React from 'react';
import PropEditorBase from './PropEditorBase'
import FlatButton from 'material-ui/FlatButton';

/**
 * onChange will be called with an array of File data, e.g.
 * {
 *   "url": "raw data or url",
 *   "lastModified": last modified time of the file, in millisecond since the UNIX epoch (January 1st, 1970 at Midnight).
 *   "lastModifiedDate": last modified Date of the file referenced by the File object.
 *   "name": name of the file referenced by the File object.
 *   "size": size, in bytes, of the data contained in the Blob object.
 *   "type": string indicating the MIME type of the data contained in the Blob. If the type is unknown, this string is empty.
 * }
 */
export default class FileEditor extends React.Component {
  changed() {
    const files = this.input.files;
    if(files.length > 0) {
      let result = [];
      for(let idx = 0; idx < files.length; idx++) {
        const reader = new FileReader();
        const file = files[idx];
        reader.addEventListener("load", () => {
          const clone = {
            "url": reader.result,
            "lastModified": file.lastModified,
            "lastModifiedDate": file.lastModifiedDate,
            "name": file.name,
            "size": file.size,
            "type": file.type,
          };
          result.push(clone);
          if(result.length === files.length) {
            this.props.onChange(result);
          }
        }, false);
        reader.readAsDataURL(file);
      }
    }
    else {
      this.props.onChange([]);
    }
  }
  render() {
    this.props.data.value = this.props.data.value || [];
    let idx = 0;
    const imagesPreview = this.props.data.value.map(file => {
      if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
        return <img
          key = {idx++}
          title = {file.name}
          src = {file.url}
        />
      }
      return null;
    });
    return <PropEditorBase data={this.props.data}>
      {imagesPreview}
      <FlatButton
        label="Browse"
        labelPosition="before"
        onClick={e => {
          this.props.onBrowse(e)
          if(!e.defaultPrevented) this.input.click();
        }}
      >
        <input
          accept={this.props.data.accept || ''}
          multiple={this.props.data.multiple || ''}
          ref={c => this.input = c}
          type="file"
          onChange={e => this.changed()}
        />
      </FlatButton>
    </PropEditorBase>;
  }
}
