module.exports = function (app) {
    // Load Home page
    app.get("/", function (req, res) {
      res.render("home");
    });

    app.get("/saved", function (req, res) {
      res.render("saved");
    });
};