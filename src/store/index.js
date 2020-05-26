import { createStore, applyMiddleware } from "redux";

import {
  offlineMiddleware,
  suspendSaga,
  consumeActionMiddleware
} from "redux-offline-queue";

import createSagaMiddleware from "redux-saga";

import rootReducer from "./ducks";
import rootSaga from "./sagas";

const middlewares = [];

const sagaMiddleware = createSagaMiddleware();

{/* 
  IMPORTANTE OS MIDDLEWARES ESTAREM EXATAMENTE NESSA ORDEM:

  1º - offlineMiddleware
  2º - suspendSaga
  3º - consumeActionMiddleware
*/}

// principal middleware que vai lidar com as ações offline.
// Irá salvar as ações que precisam ser salvas na fila.
// Identifica que está offline e salva na fila as ações que precisam de API.
middlewares.push(offlineMiddleware());

// Evita que o saga execute se o usuário estiver offline.
middlewares.push(suspendSaga(sagaMiddleware));

// Irá consumir a fila quando o usuário voltar online, para enviar as requisições a API. 
middlewares.push(consumeActionMiddleware());

const createAppropriateStore = __DEV__ ? console.tron.createStore : createStore;

const store = createAppropriateStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

sagaMiddleware.run(rootSaga);

export default store;
