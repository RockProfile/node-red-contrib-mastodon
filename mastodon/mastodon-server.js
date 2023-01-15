module.exports = function(RED) {
    function MastodonServer(n) {
        // Node  to create the shared connection to Mastodon
        RED.nodes.createNode(this,n);
        this.api_url = n.apiurl;
        this.access_token = this.credentials.accesstoken;
        var mastodon_config = {
            access_token: this.access_token,
            api_url: this.api_url,
        };
        var Mastodon = require('mastodon');
        this.connection = new Mastodon(mastodon_config);
    }
    RED.nodes.registerType(
        "mastodon-server",
        MastodonServer,
        {
            credentials: {
                accesstoken: {
                    type: "password"
                }
            }
        }
    );
}
