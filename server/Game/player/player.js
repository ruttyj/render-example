const { isDef, els, isNum, isObj, makeVar, makeList } = require("../utils.js");
const CardContainer = require("../card/cardContainer.js");
const Collection = require("../collection/collection.js");

function makePlayerHand(gameRef) {
  return {
    ...CardContainer(gameRef),
  };
}

function makePlayerBank(gameRef) {
  return {
    ...CardContainer(gameRef),
  };
}

//------------------------------
//        Make Player
//------------------------------
function Player(playerManagerRef) {
  const mState = {
    hand: makePlayerHand(playerManagerRef.getGameRef()),
    bank: makePlayerBank(playerManagerRef.getGameRef()),
  };

  const playerKey = makeVar(mState, "playerKey", null);
  const playerManager = makeVar(mState, "playerManager", playerManagerRef);

  const mCollectionIds = makeList(mState, "collections", [], {
    mutator: (v) => parseInt(v, 10),
  });

  function getHand() {
    return mState.hand;
  }

  function getBank() {
    return mState.bank;
  }

  const publicScope = {
    ...mState,
    setPlayerManager: playerManager.set,
    getAllCollectionIds: mCollectionIds.toArray,
    addCollectionId: mCollectionIds.push,
    hasCollectionId: mCollectionIds.hasValue,
    removeCollectionId: mCollectionIds.removeValue,
    getKey: playerKey.get,
    setKey: playerKey.set,
    hasKey: playerKey.has,
    removeKey: playerKey.remove,
    getBank,
    getHand,
  };

  function getPublic() {
    return { ...publicScope };
  }

  return getPublic();
}

module.exports = Player;
