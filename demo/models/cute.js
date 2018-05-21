export default {
  namespace: 'cute',
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
    console.log(this.add());
    return {
      count: this.state.count + 1
    };
  }
};
