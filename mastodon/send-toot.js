module.exports = function(RED) {
    function SendToot(config) {
        RED.nodes.createNode(this, config);

        let node = this;
        this.mastodon_server = RED.nodes.getNode(config.server);

        node.on('input', function(msg) {
            let payload = msg.payload
            if (config.recipients){
                payload = msg.payload + "\n\n" + config.recipients;
            }

            let parameters = {
                status: payload,
                visibility: config.visibility,
            };

            if (this.mastodon_server.connection) {
                this.mastodon_server.connection.post('statuses', parameters);
            }
        });
    }
    RED.nodes.registerType(
        "send-toot",
        SendToot,
    );
}
