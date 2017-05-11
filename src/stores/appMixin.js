export default {
  startDragging() {
    if (this.get('dragging')) {
      return;
    }
    this.set('dragging', true);
    this.changed();
  },
  stopDragging() {
    if (!this.get('dragging')) {
      return;
    }
    this.set('dragging', false);
    this.changed();
  }
};
