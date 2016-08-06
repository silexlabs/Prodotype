import React from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';

export default class PropEditorBase extends React.Component {
  state = {}
  render() {
    let debug = <code>{ JSON.stringify(this.props.data) }</code>;
    return <Card>
      <CardHeader
        title={this.props.data.name}
        subtitle={this.props.data.description}
      />
      <CardText>
        { this.props.children }
        <br />
        <FlatButton
          secondary={true}
          label="Debug"
          onClick={() => this.setState({debug: !this.state.debug})} />
        { this.state.debug ? debug : '' }
      </CardText>
    </Card>;
  }
}
