"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DesignTokens_1 = require("@classes/DesignTokens");
var designTokens = DesignTokens_1.DesignTokens.create({
    mediaQueries: {
        mobile: "(max-width: 475px)",
        tablet: "(min-width: 767px)",
        desktop: "(min-width: 1024px)",
        wide: "(min-width: 1228px)"
    }
})
    .extend(function (_a) {
    var create = _a.create;
    return ({
        color: {
            primary: create("red"),
            secondary: create("blue"),
            tertiary: create("green")
        },
        fontFamily: {
            default: create("arial")
        },
        fontSize: {
            small: create(16, { tablet: 24 }),
            medium: create(24, { tablet: 32 }),
            large: create(32, { tablet: 48 })
        },
        lineHeight: {
            small: create(1, { tablet: 1.2 }),
            medium: create(1.2, { tablet: 1.4 }),
            large: create(1.4, { tablet: 1.6 })
        }
    });
})
    .extend(function (_a) {
    var create = _a.create, use = _a.use;
    return ({
        font: {
            small: create("".concat(use("fontFamily.default"), " ").concat(use("fontSize.small"), " / ").concat(use("lineHeight.small"))),
            medium: create("".concat(use("fontFamily.default"), " ").concat(use("fontSize.medium"), " / ").concat(use("lineHeight.medium"))),
            large: create("".concat(use("fontFamily.default"), " ").concat(use("fontSize.large"), " / ").concat(use("lineHeight.large")))
        }
    });
});
exports.default = designTokens;
