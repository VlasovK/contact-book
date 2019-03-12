import React, {Component, Fragment} from 'react';
import UserCard from './components/user-card.js';
import EditMenu from './components/edit-menu.js';
// alphabetical sorting
function sortArray(array) {
  return array.sort((a, b) => {
    if (a.name > b.name) return 1;
    else return -1;
  });
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: JSON.parse(localStorage.getItem('users')) || [],
      activeUser: null,
      search: '',
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
  handleSearch(event) {
    this.setState({search: event.target.value});
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
    let userCard;
    if (!this.state.isVisibleEditMenu && this.state.activeUser === null) {
      userCard = <button className="button button-new-contact"
        onClick={this.showEditMenu.bind(this)}>
          New Contact
        </button>;
    } else if (this.state.isVisibleEditMenu) {
      userCard = (
        <EditMenu
          user={this.state.users[this.state.activeUser]
            || {name: '', email: '', phone: '', website: '', avatar: '',
              address: {country: '', state: '', city: '', streetA: '',
              streetB: '', streetC: '', streetD: '', zipcode: ''},
              company: {name: ''}}}
          activeUser={this.state.activeUser}
          acceptChanges={this.acceptChanges.bind(this)}
          deleteContact={this.deleteContact.bind(this)}/>
        );
    } else {
      userCard = <UserCard activeUser={this.state.activeUser}
        showEditMenu={this.showEditMenu.bind(this)}/>;
    }
    let id;
    let usersList = this.state.users.map((user, i) => {
      this.state.activeUser === i ? id = 'select-user' : id='';
      if (~user.name.toLowerCase().indexOf( this.state.search.toLowerCase() )) {
        return (
          <div key={i} className="user-string" id={id}
            onClick={this.activateUser.bind(this, i)}>
            {user.name}
          </div>
        );
      } else return null;
    });
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
            <input value={this.state.search} className="search"
              onChange={this.handleSearch.bind(this)} placeholder="search"/>
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
