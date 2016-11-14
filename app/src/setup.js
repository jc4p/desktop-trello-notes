import React, { Component } from 'react';
import electron, { ipcRenderer } from 'electron';
import Trello from 'node-trello';
import Spinner from 'react-spinkit'

import styles from './styles.scss'

export class TrelloCard extends Component {
  state = {
    open: false
  }

  constructor(props) {
    super(props);

    this.onCardClick = this.onCardClick.bind(this);
  }

  onCardClick() {
    ipcRenderer.sendSync('open-card', this.props.cardId);
  }

  render() {
    return (
      <div className={styles.cardItem} onClick={this.onCardClick}>
        <span className={styles.subtitle}>{this.props.cardName}</span>
      </div>
    )
  }
}

export default class SetupView extends Component {
  state = {
    logged_in: false,
    connecting: false,
    trello_token: "",
    username: "",
    board_id: null,
    trello_boards: [],
    trello_cards: [],
  }
  api = null

  constructor(props) {
    super(props);

    this.componentDidMount = () => { this.checkLogin(); }

    this.onConnectPressed = this.onConnectPressed.bind(this);
    this.onTokenChange = this.onTokenChange.bind(this);
    this.onLoginPressed = this.onLoginPressed.bind(this);
    this.onBoardChanged = this.onBoardChanged.bind(this);
    this.loadCards = this.loadCards.bind(this);
  }

  checkLogin() {
    const storageToken = window.localStorage.getItem('trello_token');
    if (storageToken) {
      const api = new Trello(process.env.TRELLO_API_KEY, storageToken);
      this.api = api;
      this.setState({ logged_in: true, trello_token: storageToken });
      this.getName();
    }
  }

  onConnectPressed() {
    const name = encodeURI("Kasra's Trello Notes Helper")
    const connectUrl = `https://trello.com/1/connect?key=${process.env.TRELLO_API_KEY}&name=${name}&response_type=token`;
    ipcRenderer.sendSync('open-url', connectUrl);
    this.setState({ connecting: true });
  }

  onTokenChange(event) {
    const token = event.target.value;
    if (token) {
      this.setState({ trello_token: token });
    }
  }

  onLoginPressed() {
    if (this.state.trello_token) {
      window.localStorage.setItem('trello_token', this.state.trello_token);
      const api = new Trello(process.env.TRELLO_API_KEY, storageToken);
      this.api = api;
      this.setState({ connecting: false, logged_in: true });
      this.getName();
    }
  }

  getName() {
    this.api.get("/1/members/me", (err, data) => {
      if (err) throw err;
      if (data && data['fullName'])
        this.setState({username: data['fullName']})
    });
    this.api.get("/1/members/me/boards", {filter: 'open', memberships: 'me'}, (err, data) => {
      if (err) throw err;
      if (data && data.length > 0) {
        const justAdmin = data.filter(b => b.memberships[0].memberType == 'admin');
        this.setState({ trello_boards: justAdmin })
      }
    });
  }

  onBoardChanged(event) {
    const boardId = event.target.value;
    this.setState({ board_id: boardId });
    this.loadCards(boardId);
  }

  loadCards(boardId) {
    this.api.get(`/1/boards/${boardId}/cards`, {fields: 'name,idList,url'}, (err, data) => {
      if (err) throw err;
      this.setState({ trello_cards: data });
    });
  }

  render() {
    return (
      <div className={`${styles.container} ${styles.mainContainer}`}>
        <p className={styles.lead}>Hello{ this.state.username && ` ${this.state.username}`}</p>
        { this.state.logged_in && this.state.trello_boards.length > 0 &&
          <div>
            <p>Select a board:</p>
            <select onChange={this.onBoardChanged}>
              {this.state.trello_boards.map(function(item, i) {
                return (
                  <option key={i} value={item.id}>{item.name}</option>
                )
              })}
            </select>
          </div>
        }
        { this.state.logged_in && this.state.board_id &&
          <div className={styles.cardContainer}>
          { this.state.trello_cards.length == 0 &&
           <Spinner spinnerName="cube-grid" noFadeIn={true} className={styles.loadingSpinner} /> 
          }
          { this.state.trello_cards.length > 0 && 
            this.state.trello_cards.map(function(item, i) {
              return (
                <TrelloCard key={i} cardId={item.id} cardName={item.name} />
              )
            })
          }
          </div>
        }
        { !this.state.logged_in && !this.state.connecting &&
          <div>
            <p>You are not logged in.</p>
            <button className={styles.button} onClick={this.onConnectPressed}>Connect to Trello</button>
          </div>
        }
        { !this.state.logged_in && this.state.connecting &&
          <div>
            <p>Please follow the instructions on the Trello login page then paste your token below when ready:</p>
            <form>
              <fieldset>
                <input type="text" placeholder="Trello token" onChange={this.onTokenChange} />
                <input type="submit" value="Connect" className={styles.buttonPrimary} onClick={this.onLoginPressed}/>
              </fieldset>
            </form>
          </div>
        }
      </div>
    )
  }
}