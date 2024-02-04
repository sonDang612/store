/* eslint-disable class-methods-use-this */
import Document, { Head, Html, Main, NextScript } from "next/document";
// import Script from "next/script";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
            rel="stylesheet"
          />

          {typeof window === "undefined" && (
            <style
              id="holderStyle"
              dangerouslySetInnerHTML={{
                __html: `
         *, *::before, *::after {
           transition: none !important;
         }
         `,
              }}
            />
          )}
        </Head>

        <body>
          {/* <div id="fb-root"></div>

          <div id="fb-customer-chat" className="fb-customerchat"></div> */}
          {/* <body className="no-fouc"> */}

          <script>0</script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

/* <Script strategy="lazyOnload" id="my-script">
{`

var chatbox = document.getElementById('fb-customer-chat');
chatbox.setAttribute("page_id", "105035252388868");
chatbox.setAttribute("attribution", "biz_inbox");

window.fbAsyncInit = function() {
FB.init({
xfbml            : true,
version          : 'v15.0'
});
};

(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

`}
</Script> */
