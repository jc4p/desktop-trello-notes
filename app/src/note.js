import { h, render, Component } from 'preact';
import electron, { ipcRenderer } from 'electron';
import Trello from 'node-trello';
import marked from 'marked';

import styles from './styles.scss'

export default class NoteView extends Component {
  state = {
    card_id: null,
    card: null
  }
  api = null

  constructor(props) {
    super(props);

    this.componentDidMount = () => { this.getCardId(); }
    this.loadCard = this.loadCard.bind(this);

    const storageToken = window.localStorage.getItem('trello_token');
    if (storageToken) {
      const api = new Trello(process.env.TRELLO_API_KEY, storageToken);
      this.api = api;
    } else {
      console.log("Error: No trello token");
    }
  }

  getCardId() {
    var cardId = location.search.substring(1);
    this.loadCard(cardId);
  }

  loadCard(cardId) {
    this.api.get(`/1/cards/${cardId}`, {}, (err, data) => {
      if (err) throw err;
      if (data) {
        this.setState({ card: data, card_id: cardId });
      }
    });
  }

  render() {
    return (
      <div className={styles.noteContainer}>
        {this.state.card != null && 
          <div dangerouslySetInnerHTML={{__html: marked(this.state.card.desc)}} className={styles.noteBody} />
        }
        {this.state.card == null &&
          <p className={styles.loadingSpinner}> #TODO: Loading indicator</p>
        }
      </div>
    )
  }
}