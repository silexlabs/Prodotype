import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as MaterialUi from 'material-ui/';

export default class Editor extends React.Component {
  render() {
    console.log('xxx', this.props.componentsData, this.props.templateName, this.props.data);
    if(this.props.data
      && this.props.templateName
      && this.props.componentsData
      && this.props.componentsData[this.props.templateName]
    ) {
      return <MuiThemeProvider>
        <section>
          <h1>Editing ({this.props.templateName})</h1>
          <p>{JSON.stringify(this.props.componentsData[this.props.templateName])}</p>
          <p>{JSON.stringify(this.props.data)}</p>
        </section>
      </MuiThemeProvider>;

    }
    // nothing selected
    return <MuiThemeProvider>
      <section>Please select a component</section>
    </MuiThemeProvider>;
  }
}
