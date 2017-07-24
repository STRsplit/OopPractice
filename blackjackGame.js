//Make a blackjack game using object orientend programming

/* Plan
- Game class
  - Take in player names or player obj
  - Dealer player
  - Curr player (turn)

  Methods:
  - shuffle cards
  - deal cards
  - check player cards
  - checkwin


- Players class
  - player has current hand
  Methods:
  - actions:
    - hit: deal card from deck
    - stand: next player
  - calculate cards
    - store current score?
  - check player
    - if cards are bust clear player

*/

class Cards {
  constructor(){
    this.values = {
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
      'A': { score: 11 }
    },
    this.suits = ['hearts', 'spades', 'clubs', 'diamonds'],
    this.deck = [];
    this.createDeck();
  }
  createDeck() {
    let newDeck = [];
    for(let i = 0; i < this.suits.length; i++){
      let suit = this.suits[i];
      for(let key in this.values){
        let cardItem = Object.assign({}, this.values[key], {
          suit: suit,
          card: key,
        })
        newDeck.push(cardItem)
      }
    }
    this.shuffleDeck(newDeck)
  }
  shuffleDeck(cards) {
    let shuffledDeck = cards.slice();

    for(let x = 0; x < shuffledDeck.length; x++){
      let currCard = shuffledDeck[x];
      let randomInd = Math.floor(Math.random() * shuffledDeck.length);
      let randomCard = shuffledDeck[randomInd];
      shuffledDeck[x] = randomCard;
      shuffledDeck[randomInd] = currCard;
    }
    this.deck = shuffledDeck;
    return this.deck;
  }
}
class Game {
  constructor(...players){
    this.players = [...players].concat(new Player('dealer'));
    this.dealer = this.players[this.players.length - 1];
    this.cards = new Cards().deck;
    this.currentPosition = 0;
    this.blackJacks = []
    this.currentPlayer = this.players[this.currentPosition];
    this.winners = [];
    this.dealPlayers();
  }

  checkForBlackJack(){
    let blackJacks = this.players.filter(player => {
      return player.score === 21
    })
    if(blackJacks.length){
      if(blackJacks.includes(this.dealer)){
        this.calculateGame(this.dealer);
      } else {
        this.players = blackJacks.map(player => player.hasBlackJack = true)
        this.blackJacks = blackJacks;
      }
    }
  }
  dealPlayers(){
    let cardsDealt = 0;
    while(cardsDealt < 2){
      cardsDealt++;
      this.players.forEach(player => {
        player.hand.push(this.cards[0]);
        player.getScore();
        this.cards = this.cards.slice(1);
      })
    }
    this.checkForBlackJack();
  }
  handleHit () {
    this.currentPlayer.addCard(this.cards[0]);
    this.cards = this.cards.slice(1);
  }
  handleTurn(action){
    if(this.blackJacks.includes(this.currentPlayer)){
      this.currentPosition++;
      this.currentPlayer = this.players[this.currentPosition]
    }
    if(action === 'stand'){
      this.currentPosition++;
      if(this.currentPosition === this.players.length){
        this.calculateGame()
        return;
      } else {
        this.currentPlayer = this.players[this.currentPosition];
      }
    }
    if(action === 'hit'){
      this.handleHit()
      if(!this.currentPlayer.checkCards()){
        if(this.currentPlayer === this.dealer){
          this.calculateGame()
        } else if(this.currentPosition === this.players.length){
          this.calculateGame()
          return;
        }
        else {
          this.currentPosition++;
          this.currentPlayer = this.players[this.currentPosition]
        }
      } else if(this.currentPlayer.score > 17){
        this.currentPosition++;
        this.currentPlayer = this.players[this.currentPosition]
      }
      else {
          this.currentPlayer = this.players[this.currentPosition]
      }
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
      console.log('you all lose, dealer wins', this.dealer.score)
      return;
    }
    this.winners = this.getWinners();
    console.log(this.winners);
  }
}
class Player {
  constructor(name){
    this.name = name;
    this.hand = [];
    this.score = 0;
    this.status = true;
    this.hasBlackJack = false;
  }
  handleAce(score) {
    let betterScore = score;
    for(let i = 0; i < this.hand.length; i++){
      let currCard = this.hand[i];
      if(currCard.card === 'A'){
        betterScore += 10;
      }
    }
    if(betterScore > score && betterScore <= 21){
      return betterScore;
    }
    return score;
  }
  getScore(){
    let score = 0;
    this.hand.forEach(card => {
      score += card.score;
    })
    this.score = this.handleAce(score);
  }
  addCard(card) {
    this.hand.push(card)
  }
  checkCards(){
    this.getScore();
    if(this.score > 21){
      this.status = false;
    }
    return this.status;
  }
}

