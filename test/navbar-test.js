import FazNavbarBrand from "../navbar/navbar-brand";
import FazNavbar from "../navbar/navbar";

QUnit.module("faz/navbar/brand");

let navbarBrand = new FazNavbarBrand();

QUnit.test("Navbar Brand defaults.", function(assert) {
    assert.equal(
        navbarBrand.isLink,
        false,
        "Brand isLink default is: false."
    );
});


QUnit.module("navbar/navbar");

let navbar = new FazNavbar();

QUnit.test("Navbar defaults.", function(assert) {
    assert.equal(
        navbar.brand,
        null,
        "View Model brand default is: null."
    );
    assert.notEqual(
        navbar.fazid,
        "",
        "View Model id default is a random string: \"" + navbar.fazid + "\"."
    );
});
