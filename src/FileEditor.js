import React from 'react';
import "@babel/polyfill"; import PropEditorBase from './PropEditorBase';

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
  /**
   * a custom script has intercepted the browse command
   * this happens when onBrowse is set and calls e.preventDefault()
   */
  changedCustom(fileLikeObjects) {
    this.props.onChange(fileLikeObjects);
  }
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
      if ( /\.(jpe?g|png|gif)$/i.test(file.name) || (file.type && file.type.startsWith('image')) ) {
        return <div className="image-preview"
          key = {idx++}
          title = {file.name}
          style = {{backgroundImage: 'url(' + file.url + ')'}}
        />
      }
      return null;
    });
    return <PropEditorBase data={this.props.data}>
      {imagesPreview}
      <div
        onClick={e => {
          this.props.onBrowse(e, file.url, url => {
            this.changedCustom(url);
          });
          // here the e.preventDefault might have been called
          // (case of custom browse dialog)
        }}
      >
        <input
          accept={this.props.data.accept || ''}
          multiple={this.props.data.multiple || ''}
          ref={c => this.input = c}
          type="file"
          onChange={e => this.changed()}
        />
      </div>
    </PropEditorBase>;
  }
}
