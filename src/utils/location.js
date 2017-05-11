/**
 *
 * @returns {string}
 */
export default {
  logout() {
    window.location.href = '/auth/logout';
  },

  authorize() {
    window.location.href = '/auth/login?back_url=' + encodeURIComponent(window.location.href);
  },

  login() {
    window.location.href = '/auth/login';
  },

  paymentRequired() {
    window.location.reload();
  }
}
