export function init() {
  const chatbox = document.getElementById("fb-customer-chat");
  chatbox.setAttribute("page_id", "105035252388868");
  chatbox.setAttribute("attribution", "biz_inbox");

  window!.fbAsyncInit = function () {
    // eslint-disable-next-line no-undef
    FB.init({
      xfbml: true,
      version: "v15.0",
    });
  };

  (function (d, s, id) {
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    const js = d.createElement(s) as HTMLScriptElement;
    js.id = id;
    js.src = "https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
}

/**
 *
 */
export function cleanup() {
  (function (d, id) {
    const target = d.getElementById(id);
    if (target) {
      target.parentNode.removeChild(target);
    }
  })(document, "facebook-jssdk");

  delete window.FB;
}
