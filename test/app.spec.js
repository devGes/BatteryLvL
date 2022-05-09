const assert =require("assert");

const {calculateEOL} = require("../LVLfunctions");

// let chai = require("chai");
// let chaiHttp = require("chai-http");
// let server = "http://localhost:${process.env.PORT}";


describe("the End of Life calculation", () => {
    it('should take a list of integers as input', () => {
        const result = calculateEOL([0,1,2]);
        assert.equal(result, 3)
    });
});

