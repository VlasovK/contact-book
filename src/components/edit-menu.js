import React, {Component, Fragment} from 'react';

export default class EditMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static getDerivedStateFromProps(props, state) {
    if (!state.name) {
      return state = {
        name: props.user.name,
        company: props.user.company.name,
        email: props.user.email,
        phone: props.user.phone,
        website: props.user.website,
        avatar: props.user.avatar,
        country: props.user.address.country,
        state: props.user.address.state,
        city: props.user.address.city,
        streetA: props.user.address.streetA,
        streetB: props.user.address.streetB,
        streetC: props.user.address.streetC,
        streetD: props.user.address.streetD,
        zipcode: props.user.address.zipcode
      };
    } else return null;
  }
  handleChange(key, event) {
    this.setState({[key]: event.target.value});
  }
  render() {
    let labels = [];
    for (let key in this.state) {
      labels.push(
        <Fragment key={key}>
          <label>{key}:<input value={this.state[key]}
            onChange={this.handleChange.bind(this, key)}/>
          </label><br/>
        </Fragment>
      );
    }
    return (
      <form onSubmit={this.props.acceptChanges.bind(this, this.state)}>
        {labels}
        <button type="submit" className="button button-edit">
          Save
        </button>
        <button className="button button-delete" type="button"
          onClick={this.props.deleteContact}>
          Delete
        </button>
      </form>
    );
  }
}
