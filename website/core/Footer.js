/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? language + '/' : '') + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('analytix/analytix-setup.html')}>
              Getting Started With Analytix
            </a>
            <a href={this.docUrl('bi/bi-auditors.html')}>
              BI Docs
            </a>
          </div>
          <div>
            <h5>naviga</h5>
            <a
              href="http://navigaglobal.com/"
              target="_blank">
              Website
            </a>
            <a href="http://navigaglobal.com/blog/" target="_blank">
              naviga Blog
            </a>
            <a href="https://twitter.com/navigaglobal" target="_blank">
              Twitter
            </a>
            <a href="https://www.facebook.com/navigaglobal" target="_blank">
              Facebook
            </a>
            <a href="https://www.linkedin.com/company/navigaglobal" target="_blank">
              LinkedIn
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={this.docUrl('analytix/analytix-bi-overview.html')}>Analytix Docs</a>
            <a href={this.docUrl('bi/bi-resources.html')}>BI Docs</a>
          </div>
        </section>

        <a
          href="https://navigaglobal.com"
          target="_blank">
          <img
            src={this.props.config.baseUrl + 'img/Naviga_Logo_Dark_Verticle.png'}
            alt="naviga - Venture Forward"
            width="226"
            height="42"
            style={{margin: "1em auto", display: "block", width: "226px"}}
          />
        </a>
        <section className="copyright">
          Copyright &copy; {currentYear} naviga
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
