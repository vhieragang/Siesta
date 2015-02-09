StartTest(function(t) {

    t.chain(
        { action : "click", target : ">>button[text=Insert zone 1]" },

        { action : "click", target : ">>button[text=Insert zone 2 (alternate styling)]" },

        { action : "click", target : ">>button[text=Add row]" },

        { action : "click", target : ">>button[text=Horizontal view]" },

        { action : "click", target : ">>button[text=Vertical view]" },

        { action : "click", target : ">>button[text=Add row]" }
    );
});
