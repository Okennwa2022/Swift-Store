const paypal = require("paypal-rest-sdk");

    paypal.configure({
    mode: "sandbox",
    client_id: "AfSRFPZQ0wcVt5dD07r87UMD-G-tnckKfVcpkYkJrWgM5PVbx4eTAd6bl-o6yTdaJ1hLxxNGX6L-ILoL",
    client_secret: "ELLQ9-V3WcvecLUCFQnKo2c_Dz4shTM6dfzBigQ-oPFDp4eCZ2n_wUl3EAnl8pL3t5sLJtQeGcjIpQ3U",
    });

module.exports = paypal;