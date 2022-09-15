const cors = require("cors");

const express = require("express");
const request = require("request");
const jwt_decode = require("jwt-decode");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
var bp = require("body-parser");
// app.use(
//   bp.urlencoded({
//     extended: true,
//   })
// );
// app.use(bp.json());
// // app.use(morgan("dev"));

// const corsOptions = {
//   origin: "http://localhost:8080",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.post("/login", async (req, res) => {
//   verifyUser(req, res);
// });

const verifyUser = (req, res) => {
  var options = {
    method: "POST",
    url: "http://localhost:8082/realms/amir-tests/protocol/openid-connect/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      username: req.body.email,
      password: req.body.password,
      grant_type: "password",
      client_id: "myclient",
      client_secret: "myclient",
      scope: "openid",
    },
  };

  const temp = {
    id: "u_od0sO2HUQgMH",
    user_name: "Inbar27901129",
    display_name: "Inbar",
    image_id: "#Green-BottleOpener",
    email: "inbar.i+2@openweb.com",
    has_password: true,
    verified: true,
    is_moderator: false,
    is_admin: false,
    is_journalist: false,
    is_moderation_viewer: false,
    is_community_moderator: false,
    private_profile: false,
    registered: true,
    sso_user: false,
    social: ["twitter"],
    unseen_notifications_count: null,
  };
  request(options, (err, resp) => {
    const { access_token } = JSON.parse(resp.body);
    if (!access_token) {
      res.send({ success: false, type: "2" });
      return;
    }
    const userFromToken = jwt_decode(access_token);
    const currentUser = temp || jwt_decode(access_token);
    res.send({
      currentUser,
      access_token,
      refresh_token: resp.body.refresh_token,
      success: true,
    });
  });
};

app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:8082/",
    changeOrigin: true,
    onProxyRes,
  })
);

function onProxyRes(proxyResponse, request, response) {
  proxyResponse.headers["amir-token"] = "ssssss";
}
app.listen(3321);
