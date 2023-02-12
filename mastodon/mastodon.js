/**
 * Fetch and return the configuration required to process a given task.
 *
 * @param {string} task The task being executed
 * @return {object} Object of endpoint and processor function for the given task.
 */
function fetch_task_config(task){
    // Identifies the config for the given task
    let config = {
        endpoint: 'accounts/verify_credentials',
        processor: follower_processor
    };
    if (task === "followers"){
        return config;
    }
    return config;
}

/**
 * Process a given task.
 *
 * @param {object} data Retrieved data from the API.
 * @param {object} msg Current msg payload.
 * @param {function} send Function to send the msg payload.
 * @param {function} done Function to call to signify that the task is complete.
 */
function follower_processor(data, msg, send, done){
    msg.mastodon = {
        followers_count: data['followers_count'],
        following_count: data['following_count'],
        follow_request_count: data['source']['follow_requests_count']
    };
    send(msg)
    if (done){
        done()
    }
}

module.exports = function(RED) {
    function Mastodon(config) {
        RED.nodes.createNode(this, config);

        let node = this;
        this.mastodon_server = RED.nodes.getNode(config.server);

        node.on('input', function(msg, send, done) {
            this.error(config.task);
            let task_config = fetch_task_config(config.task);

            if (this.mastodon_server.connection) {
                this.mastodon_server.connection.get(task_config.endpoint, {}, function (err, data, response) {
                    task_config.processor(data, msg, send, done);
                });
            }
        });
    }
    RED.nodes.registerType(
        "mastodon",
        Mastodon,
    );
}
