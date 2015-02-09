StartTest(function (t) {
    t.getScheduler({ renderTo : document.body });

    // This test should not load any CSS at all, and hence should display a warning about this
    t.messageBoxIsVisible('Should show a warning if CSS is not included');
})
