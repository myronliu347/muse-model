export default {
  namespace: 'count',
  state: {
    count: 1
  },

  add () {
    return {
      count: this.state.count + 1
    };
  },

  sub () {
    return {
      count: this.state.count - 1
    };
  },
  addDispatch () {
    return {
      count: this.state.count + 1
    };
  },

  addTimeOut () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          count: this.state.count + 1
        });
      }, 1000);
    });
  }
};
