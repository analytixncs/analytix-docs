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
            <a href={this.docUrl('analytixsetup.html')}>
              Getting Started With Analytix
            </a>
            <a href={this.docUrl('bi-auditors.html')}>
              BI Docs
            </a>
          </div>
          <div>
            <h5>Newscycle Solutions</h5>
            <a
              href="http://newscycle.com/"
              target="_blank">
              Newscycle Website
            </a>
            <a href="https://twitter.com/NEWSCYCLE_News?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="_blank">
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={this.props.config.baseUrl + 'blog'}>Blog</a>
          </div>
        </section>

        <a
          href="https://newscyclesolutions.com"
          target="_blank">
          <img
            src={this.props.config.baseUrl + 'img/NewscycleLogo.png'}
            alt="Newscycle Solutions"
            width="226"
            height="42"
            style={{margin: "1em auto", display: "block", width: "226px"}}
          />
        </a>
        <section className="copyright">
          Copyright &copy; {currentYear} Newscycle Solutions.
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
