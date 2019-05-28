import React from 'react';
import "@babel/polyfill"; import PropEditorBase from './PropEditorBase';

/**
 * onChange will be called with the link data, e.g.
 * {
 *   "href": "http://lexoyo.me",
 *   "title": "this is for google",
 * }
 * Also may contain target, rel, type, download
 */
export default class LinkEditor extends React.Component {
  render() {
    this.props.data.value = this.props.data.value || [];
    return <PropEditorBase data={this.props.data}>
      <div
        onClick={e => {
          if(this.props.onEditLink) this.props.onEditLink(e, this.props.data.value, obj => this.props.onChange(obj));
          // here the e.preventDefault might have been called
          // (case of custom link dialog)
          if(!e.defaultPrevented) {
            // here the e.preventDefault has not been called
            // (case of default link dialog)
            const href = prompt('Enter an url for the link', this.props.data.value.href);
            if(href) {
              this.props.onChange({
                href,
              })
            }
            else {
              this.props.onChange();
            }
          }
        }}
      >
        <input readOnly placeholder='Url' type='url' value={ this.props.data.value.href ? this.props.data.value.href : '' } />
        <input type="button" value="Edit Link" />
      </div>
    </PropEditorBase>;
  }
}
