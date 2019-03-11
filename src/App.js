import React, {Component, Fragment} from 'react';

// alphabetical sorting
function sortArray(array) {
  return array.sort((a, b) => {
    if (a.name > b.name) return 1;
    else return -1;
  });
}

class UserCard extends Component {
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
    return (
      <Fragment>
        <div onMouseEnter={this.showEditButton.bind(this)}
          onMouseLeave={this.hideEditButton.bind(this)}>
          {!this.state.isVisibleEditButton ? null
            : <img src="./img/pencil.png" alt="edit"
              className="pencil" onClick={this.props.showEditMenu}
              />}
          <img src={users[i].avatar} alt="avatar" className="avatar"/>
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
        <p className="company-name">"{users[i].company.name}"</p>
      </Fragment>
    );
  }
}

class EditMenu extends Component {
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
          <label>{key}:<input
            value={this.state[key]}
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
        <button className="button button-delete"
          onClick={this.props.deleteContact}>
          Delete
        </button>
      </form>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: JSON.parse(localStorage.getItem('users')) || [],
      activeUser: null,
      isVisibleEditMenu: false
    };
  }
  componentDidMount() {
    if (!localStorage.getItem('users')) {
      fetch('http://demo.sibers.com/users')
        .then(response => response.json())
        .then(json => {
          sortArray(json);
          localStorage.setItem('users', JSON.stringify(json));
          this.setState({users: json});
        })
        .catch(error => console.error(error));
    }
  }
  activateUser(i) {
    this.setState({isVisibleEditMenu: false});
    this.setState({activeUser: i});
  }
  showEditMenu() {
    if (this.state.activeUser === null) {
      this.setState({activeUser: this.state.users.length});
  };
    this.setState({isVisibleEditMenu: true});
  }
  acceptChanges(user, event) {
    event.preventDefault();
    let newUser = {
      name: user.name,
      company: {name: user.company},
      email: user.email,
      phone: user.phone,
      website: user.website,
      avatar: user.avatar,
      address: {
        country: user.country,
        state: user.state,
        city: user.city,
        streetA: user.streetA,
        streetB: user.streetB,
        streetC: user.streetC,
        streetD: user.streetD,
        zipcode: user.zipcode
      }
    };
    let json = JSON.parse(localStorage.getItem('users'));
    json[this.state.activeUser] = newUser;
    sortArray(json);
    localStorage.setItem('users', JSON.stringify(json));
    this.setState({users: json});
    let newIndex;
    for (let i=0; i<json.length; i++) {
      if (json[i].name === user.name) newIndex = i;
    }
    this.setState({activeUser: newIndex});
    this.setState({isVisibleEditMenu: false});
  }
  deleteContact() {
    let json = JSON.parse(localStorage.getItem('users'));
    json.splice([this.state.activeUser], 1);
    sortArray(json);
    localStorage.setItem('users', JSON.stringify(json));
    this.setState({users: json});
    this.setState({activeUser: null});
    this.setState({isVisibleEditMenu: false});
  }
  render() {
    let id;
    let usersList = this.state.users.map((user, i) => {
      this.state.activeUser === i ? id = 'select-user' : id=''
      return (
        <div key={i} className="user-string" id={id}
          onClick={this.activateUser.bind(this, i)}>
          {user.name}
        </div>
      );
    });
    let userCard;
    if (!this.state.isVisibleEditMenu && this.state.activeUser === null) {
      userCard = <button className="button"
        onClick={this.showEditMenu.bind(this)}>
          New Contact
        </button>;
    } else if (this.state.isVisibleEditMenu) {
      userCard = (
        <EditMenu
          user={this.state.users[this.state.activeUser]
            || {address: {}, company: {}}}
          activeUser={this.state.activeUser}
          acceptChanges={this.acceptChanges.bind(this)}
          deleteContact={this.deleteContact.bind(this)}/>
        );
    } else {
      userCard = <UserCard activeUser={this.state.activeUser}
        showEditMenu={this.showEditMenu.bind(this)}/>;
    }
    return (
      <Fragment>
        <header className="header">
          <h1 onClick={this.activateUser.bind(this, null)}>Contact Book</h1>
        </header>
        <main>
          <div className="users-card">
            {userCard}
          </div>
          <div className="contacts">
            {usersList}
          </div>
        </main>
        <footer>
          Test for Sibers<br/>2019
        </footer>
      </Fragment>
    );
  }
}
