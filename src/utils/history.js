import createHistory from 'history/createBrowserHistory';

/* 将 history 统一*/
const history = createHistory();
history.listen((location, action) => {});

export { history };
