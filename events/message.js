module.exports = {
    event: "message",
    once: false,
    run(message) {
        if(message.author.bot) return;
    }
};