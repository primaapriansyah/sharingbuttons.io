var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');

var Code = React.createClass({
	componentDidMount: function() {
		var $elem = $(this.getDOMNode());
		$elem.children().click(this._selectText);
		this.componentDidUpdate();
	},
	componentDidUpdate: function() {
		var text = this.props.text;
		var url = this.props.url;
		var networks = this.props.networks;
		var style = '<style>\n' + this.props.style;
		var $html = $('.code__html');
		var kilobytesNormally = 0; // See https://jonsuh.com/blog/social-share-links/, Google+, Facebook, Linkedin, Pinterest then Twitter
		var savedRequests = 0;
		var code = "";

		for (network in networks) {
			if (networks[network].visible === true) {
				kilobytesNormally += networks[network].scriptSize;
				savedRequests += networks[network].requests;
				code += '<a class="resp-sharing-button__link" href="'
				code += networks[network].link;
				code += '" target="_blank">';
				code += '<div class="resp-sharing-button resp-sharing-button--' + network.toLowerCase() + ' resp-sharing-button--' + this.props.size + '">\n    ';
				switch(this.props.size) {
					case "small":
						shareText = networks[network].img;
						break;
					case "medium":
						shareText = "Share on " + networks[network].name;
						break;
					case "large":
						shareText = networks[network].img + "Share on " + networks[network].name;
						break;
				}
				code += shareText + '\n</div>\n';
				code += '</a>\n';
				style += '\n';
				style += networks[network].style;
			}
		}

		code += style;
		code += "\n</style>";

		var savedKilobytes = parseFloat(kilobytesNormally - this._getByteCount(code) / 1000).toFixed(2);
		$('#kilobytes-saved').text(savedKilobytes);
		$('#requests-saved').text(savedRequests);
		$html.text(code);
		hljs.highlightBlock($html[0]);
	},
	render: function() {

		return (
			<div>
				<h3 className="generator__code-heading">Code</h3>
				<div className="generator__code">
					<pre onClick={this._selectText}>
						<code className="code__html" >
						</code>
					</pre>
				</div>
				<h3 className="generator__stats">You are saving ~<em><span id="kilobytes-saved"></span></em> Kilobytes and <em><span id="requests-saved"></span></em> HTTP Requests!</h3>
			</div>
		);
	},
	_selectText: function(evt) {
	    var doc = document;
	    var text = $(this.getDOMNode()).find("code")[0];

	    if (doc.body.createTextRange) { // ms
	        var range = doc.body.createTextRange();
	        range.moveToElementText(text);
	        range.select();
	    } else if (window.getSelection) { // moz, opera, webkit
	        var selection = window.getSelection();
	        var range = doc.createRange();
	        range.selectNodeContents(text);
	        selection.removeAllRanges();
	        selection.addRange(range);
	    }
	},
	_getByteCount: function(string) {
	    return encodeURI(string).split(/%..|./).length - 1;
	}
});

module.exports = Code;