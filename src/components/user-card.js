import React, {Component, Fragment} from 'react';

export default class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleEditButton: false,
    };
  }
  showEditButton() {
    this.setState({isVisibleEditButton: true});
  }
  hideEditButton() {
    this.setState({isVisibleEditButton: false});
  }
  render() {
      let users = JSON.parse(localStorage.getItem('users'));
      let i = this.props.activeUser;
      let address = users[i].address;
      let email = users[i].email;
      let web = users[i].website;
      let noAvatar = 'https://cdn4.iconfinder.com/data/icons/gray-user-management/512/rounded-512.png';
    return (
      <Fragment>
        <div onMouseEnter={this.showEditButton.bind(this)}
          onMouseLeave={this.hideEditButton.bind(this)}>
          {!this.state.isVisibleEditButton ? null
            : <img src="./img/pencil.png" alt="edit"
              className="pencil" onClick={this.props.showEditMenu}
              />}
          <img src={users[i].avatar
            || noAvatar
          } alt="avatar" className="avatar"/>
          <div className="address">
            {address.country || null} {address.state || null} {address.city
            || null}<br/>{address.streetA || null} {address.streetB || null}
            {address.streetC || null} {address.streetD || null}<br/>
            {address.zipcode || null}<br/><br/>
            <b>phone: </b>{users[i].phone || 'none'}<br/><b>email: </b>
            <a href={email}>{email || 'none'}</a><br/><b>website: </b>
            <a href={web}>{web || 'none'}</a>
          </div>
        </div>
        <h2>{users[i].name}</h2>
        <p className="company-name">{users[i].company.name}</p>
      </Fragment>
    );
  }
}
