class Uid {
  static uniqueId() {
    const user = 'id-' + Math.random().toString(36).substr(2, 16);
    return user;
  }
}
export default Uid;
