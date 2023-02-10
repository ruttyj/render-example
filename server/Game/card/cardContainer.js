const {
  isDef,
  els,
  isNum,
  isObj,
  isArr,
  jsonLog,
  makeVar,
  makeList,
  getKeyFromProp,
  reduceArrayToMap,
} = require("../utils.js");
const utils = require("./cardUtils.js");
const { INCLUDE_DEBUG_DATA } = require("../config/constants.js");

const CardContainer = function (gameRef) {
  let mState = {};

  let mGameRef = gameRef;

  const {
    inc: incTotalValue,
    dec: decTotalValue,
    get: getTotalValue,
  } = makeVar(mState, "totalValue", 0);

  const mCardOrder = makeList(mState, "cardOrder", []);

  function _shuffleCards(cards) {
    let temp = [...cards];

    let doShuffle = (temp) => {
      let lastIndex, selectedIndex;
      lastIndex = temp.length - 1;
      while (lastIndex > 0) {
        selectedIndex = utils.randomRange(0, lastIndex);
        [temp[lastIndex], temp[selectedIndex]] = [
          temp[selectedIndex],
          temp[lastIndex],
        ];
        --lastIndex;
      }
    };
    doShuffle(temp);
    doShuffle(temp);

    return temp;
  }

  function shuffle() {
    let cards = getAllCards();
    replaceAllCards(_shuffleCards(cards));
  }

  function addCard(cardOrId) {
    let cardId = parseInt(getKeyFromProp(cardOrId, "id"), 10);
    let card = mGameRef.getCard(cardOrId);
    if (isDef(card) && isDef(card.value)) {
      mCardOrder.push(cardId);
      incTotalValue(card.value);
    }
  }

  function addCards(cardOrCards) {
    if (isArr(cardOrCards))
      cardOrCards.forEach((card) => {
        addCard(card);
      });
    else addCard(cardOrCards);
  }

  function getCard(cardOrId) {
    let cardId = getKeyFromProp(cardOrId, "id");
    if (hasCard(cardId)) return mGameRef.getCard(cardId);
    return null;
  }

  function getAllCards() {
    let result = [];
    getAllCardIds().forEach((cardId) => {
      let card = getCard(cardId);
      if (isDef(card)) result.push(card);
    });
    return result;
  }

  function getCards(cardIds = null) {
    let shouldReturnAll = !isDef(cardIds);

    let result = [];
    if (shouldReturnAll) {
      return getAllCardIds();
    } else if (isArr(cardIds)) {
      let lookup = reduceArrayToMap(cardIds);
      mCardOrder.forEach((cardId) => {
        if (isDef(lookup[cardId])) {
          let card = getCard(cardId);
          if (isDef(card)) result.push(card);
        }
      });
    }
    return result;
  }

  function getAllCardIds() {
    return mCardOrder.map((v) => v);
  }

  function hasCard(cardOrId) {
    let cardId = getKeyFromProp(cardOrId, "id");
    return isDef(mCardOrder.find((cid) => String(cid) === String(cardId)));
  }

  // returns a card if exists but does not remove
  function getCardById(cardId) {
    // return card else null
    return findCard((card) => String(card.id) === String(cardId));
  }

  function giveCardsById(arrCardId) {
    return arrCardId.map((cardId) => giveCardById(cardId));
  }

  function removeCard(cardOrId) {
    let cardId = getKeyFromProp(cardOrId, "id");
    let card = getCard(cardId);
    if (isDef(card.value)) decTotalValue(card.value);
    mCardOrder.removeByValue(cardId);
  }

  // returns and removed form card list
  function giveCardById(cardId) {
    let card = getCardById(cardId);
    if (isDef(card)) {
      removeCard(card);
      return card;
    }
    return null;
  }

  function giveCard(cardOrId) {
    let cardId = getKeyFromProp(cardOrId, "id");
    return giveCardById(cardId);
  }

  function giveCards(cardsOrIds) {
    return cardsOrIds.map((cardOrId) => {
      let cardId = getKeyFromProp(cardOrId, "id");
      return giveCard(cardId);
    });
  }

  function replaceAllCards(newCards) {
    giveCards(getAllCards());
    addCards(newCards);
  }

  function getBottomCards(num) {
    let result = [];
    let stopIndex = num - 1;
    if (num > 0) {
      for (let i = 0; i <= stopIndex; ++i) {
        let cardId = mCardOrder.get(i);
        let card = getCard(cardId);
        if (isDef(card)) {
          result.push(card);
        }
      }
    }
    return result;
  }

  function getTopCards(num) {
    let result = [];
    let lastIndex = mCardOrder.count() - 1;
    if (lastIndex > -1) {
      for (let i = lastIndex - num + 1; i <= lastIndex; ++i) {
        let cardId = mCardOrder.get(i);
        let card = getCard(cardId);
        if (isDef(card)) {
          result.push(card);
        }
      }
    }
    return result;
  }

  function getTopCard() {
    let topCards = getTopCards(1);
    if (topCards.length > 0) {
      return topCards[0];
    }
    return null;
  }

  function pop() {
    let card = getTopCard();
    return giveCard(card);
  }

  function serialize() {
    let result = {
      totalValue: getTotalValue(),
      count: mCardOrder.count(),
      cardIds: [...mCardOrder.getAll()],
    };

    if (INCLUDE_DEBUG_DATA) {
      result.cards = [...getAllCards()];
    }

    return result;
  }

  function findCard(fn) {
    let selfRef = getPublic();
    let result = null;
    mCardOrder.forEach((cardId) => {
      if (!isDef(result)) {
        let card = getCard(cardId);
        if (isDef(card) && fn(card, cardId, selfRef)) {
          result = card;
        }
      }
    });

    return result;
  }

  const publicScope = {
    getCards,
    getAllCards,
    getAllCardIds,

    getTotalValue,
    getCount: mCardOrder.count,
    count: mCardOrder.count,

    shuffle,

    pop,

    addCard,
    addCards,
    hasCard,
    removeCard,
    findCard,
    find: findCard,
    getCard,
    getCardById,
    getTopCard,
    getTopCards,
    getBottomCards,
    giveCardById,
    giveCard,
    giveCards,
    giveCardsById,

    replaceAllCards,

    serialize,
  };

  function getPublic() {
    return { ...publicScope };
  }

  return getPublic();
};

module.exports = CardContainer;
