const gameCards = {
  values: {
    '2': { score: 2 },
    '3': { score: 3 },
    '4': { score: 4 },
    '5': { score: 5 },
    '6': { score: 6 },
    '7': { score: 7 },
    '8': { score: 8 },
    '9': { score: 9 },
    '10': { score: 10 },
    'J': { score: 10 },
    'Q': { score: 10 },
    'K': { score: 10 },
    'A': { score: 1 }
  },
  suits: ['hearts', 'spades', 'clubs', 'diamonds']
}
/* Make a blackjack game using object orientend programming */

const createDeck = ({values, suits}) => {
    let newDeck = [];
    for(let i = 0; i < suits.length; i++){
      let suit = suits[i];
      for(let card in values){
        let cardItem = Object.assign({}, values[card], {
          suit,
          card
        })
        newDeck.push(cardItem)
      }
    }
    return shuffleDeck(newDeck);
  }
const shuffleDeck = deck => {
    let shuffledDeck = deck.slice();
    for (let i = deck.length - 1; i > 0; i--){
      let n = Math.floor(Math.random() * (1 + i));
      let currCard = shuffledDeck[i];
      shuffledDeck[i] = shuffledDeck[n];
      shuffledDeck[n] = currCard;
    }
    return shuffledDeck;
}
const getDeck = (deck) => {
  return createDeck(deck);
}

const gameStats = {
  results: [],
  game: 0,
  addWinner: function(winners){
    this.game++;
    this.results.push({game: this.game, winners})
  }
}
  
class Game {
  constructor(...players){
    this.players = [...players].concat(new Player('dealer'));
    this.dealer = this.players[this.players.length - 1];
    this.cards = createDeck(gameCards)
    this.currentPosition = 0;
    this.blackJacks = [];
    this.currentPlayer = this.players[this.currentPosition];
    this.winners = [];
    this.dealPlayers();
  }

  checkForBlackJack(){
    if(this.dealer.score === 21){
      this.calculateGame(this.dealer)
    } else {
      this.players = this.players.filter(player => {
        if(player.score === 21){
          player.hasBlackJack = true;
          this.blackJacks.push(player)
        } else {
          return player;
        }
      })
    }
  }
  dealPlayers(){
    let cardsDealt = 0;
    while(cardsDealt < 2){
      cardsDealt++;
      this.players.forEach(player => {
        let card = this.cards.pop();
        player.addCard(card);
        player.getScore();
      })
    }
    this.checkForBlackJack();
  }
  handleHit () {
    let card = this.cards.pop();
    this.currentPlayer.addCard(card);
  }
  handleTurn(action){
    if(action === 'stand'){
      this.currentPosition++;
      if(this.currentPosition === this.players.length){
        return this.calculateGame();
      } else {
        this.currentPlayer = this.players[this.currentPosition];
      }
    }
    if(action === 'hit'){
      this.handleHit()
      if(!this.currentPlayer.checkCards()){
        if(this.currentPlayer === this.dealer){
          return this.calculateGame();
        }
          this.currentPosition++;
          this.currentPlayer = this.players[this.currentPosition]
      } 
      if(this.currentPlayer.score > 17){
        this.currentPosition++;
      }
      this.currentPlayer = this.players[this.currentPosition];
    }
  }
  getWinners() {
    let winners = this.players.filter(player => {
      return player.status;
    })
    if(!this.dealer.status){
      return winners.map(winner => winner.name)
    } else {
      return winners.reduce((ourWinners, remainingPlayer) => {
        if(remainingPlayer.score > this.dealer.score){
          ourWinners.push(remainingPlayer.name)
        }
      }, [])
    }
    
  }
  calculateGame(dealer){
    if(dealer){
      gameStats.addWinner(this.dealer)
    }
    this.winners = this.getWinners();
    gameStats.addWinner(this.winners);
  }
}
class Player {
  constructor(name, buyin = 20){
    this.name = name;
    this.purse = buyin;
    this.hand = [];
    this.score = 0;
    this.status = true;
    this.hasBlackJack = false;
  }

  handleAce(card) {
    return this.score <= 10 ? Object.assign(card, { score: 11 }) : card;
  }

  getScore(){
    return this.score;
  }
  
  addCard(card) {
    let finalCard = card.card === 'A' ? this.handleAce(card) : card;
    this.score += finalCard.score;
    this.hand.push(finalCard);
  }

  checkCards(){
    this.getScore();
    if(this.score > 21){
      this.status = false;
    }
    return this.status;
  }
}
