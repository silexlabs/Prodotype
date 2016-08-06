import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as MaterialUi from 'material-ui/';

export default class Editor extends React.Component {
  render() {
    return <MuiThemeProvider>
      <section>test</section>
    </MuiThemeProvider>;

  }
}
