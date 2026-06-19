import "./Passport Library/passport.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import {
//   generateAuthUrl,
//   loginWithGoogle,
// } from "./services/loginWithGoogle.js";
const app = express();
const PORT = process.env.PORT || 3000;
import userDB from "./userDB.json" with { type: "json" };
import sessionDB from "./sessionDB.json" with { type: "json" };
import fs from "node:fs/promises";
import passport from "passport";

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }),
);

//Generating Url and Redirecting to it
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "consent",
    session: false,
  }),
);
// ^
// |
// Replaced_With
// app.get("/auth/google", (req, res) => {
//   let googleAutherizationUrl = generateAuthUrl()
//   res.redirect(googleAutherizationUrl);
// });

//Extract Auth code and Exchange for id_token and after interacting with DB make redirect() to /callback
app.get(
  "/get-code",
  passport.authenticate("google", {
    failureRedirect: "http://127.0.0.1:5500/callback.html?error=false",
    session: false,
  }),
  async (req, res) => {
    // console.log(req.user._json);

    try {
      let { sub, email, name, picture } = req.user._json;
      let existingSession = sessionDB.find(({ id, uid }) => uid == sub);
      if (existingSession) {
        return res.redirect(
          `http://127.0.0.1:5500/callback.html?sid=${existingSession.id}`,
        );
      }

      let existingUser = userDB.find(({ id }) => id === sub);
      if (existingUser) {
        let id = crypto.randomUUID();
        sessionDB.push({ id, uid: sub });
        await fs.writeFile(
          "./sessionDB.json",
          JSON.stringify(sessionDB, null, 2),
        );
        return res.redirect(`http://127.0.0.1:5500/callback.html?sid=${id}`);
      }

      let createdUser = { id: sub, email, name, picture };
      userDB.push(createdUser);
      await fs.writeFile("./userDB.json", JSON.stringify(userDB, null, 2));

      let id = crypto.randomUUID();

      let createdSession = { id, uid: sub };
      sessionDB.push(createdSession);
      await fs.writeFile(
        "./sessionDB.json",
        JSON.stringify(sessionDB, null, 2),
      );

      res.redirect(`http://127.0.0.1:5500/callback.html?sid=${id}`);
    } catch (error) {
      res.redirect(`http://127.0.0.1:5500/callback.html?error=true`);
      console.log("Error From getCode :", error.message);
      next(error);
    }
  },
);
// ^
// |
// Replaced_With
// app.get("/get-code", async (req, res, next) => {
//   try {
//     let code = req.query.code;
//     if (code) {

//     }
//     let { sub, email, name, picture } = await loginWithGoogle(code);

//     let existingSession = sessionDB.find(({ id, uid }) => uid == sub);

//     if (existingSession) {

//       return res.redirect(
//         `http://127.0.0.1:5500/callback.html?sid=${existingSession.id}`,
//       );
//     }

//     let existingUser = userDB.find(({ id }) => id === sub);
//     if (existingUser) {
//       let id = crypto.randomUUID();
//       sessionDB.push({ id, uid: sub });
//       await fs.writeFile("./sessionDB.json", JSON.stringify(sessionDB, null, 2));
//       return res.redirect(`http://127.0.0.1:5500/callback.html?sid=${id}`);
//     }

//     let createdUser = { id: sub, email, name, picture };
//     userDB.push(createdUser);
//     await fs.writeFile("./userDB.json", JSON.stringify(userDB, null, 2));

//     let id = crypto.randomUUID();

//     let createdSession = { id, uid: sub };
//     sessionDB.push(createdSession);
//     await fs.writeFile("./sessionDB.json", JSON.stringify(sessionDB, null, 2));

//     res.redirect(`http://127.0.0.1:5500/callback.html?sid=${id}`);

//   } catch (error) {
//     res.redirect(`http://127.0.0.1:5500/callback.html?error=true`);
//     console.log('Error From getCode :', error.message);
//     next(error)
//   }

// });

//Setting sid Cookies to browser side.

app.get("/set-session-cookie", (req, res) => {
  let { sid } = req.query;
  res.cookie("sid", sid, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.end();
});

app.get("/profile", (req, res, next) => {
  let { sid } = req.cookies;
  if (!sid) {
    return res.json({ data: "You are not logged in", isLogin: false });
  }
  let sessionInfo = sessionDB.find(({ id }) => id == sid);
  if (!sessionInfo) {
    return next({ data: "session not available", isLogin: false });
  }
  let userInfo = userDB.find(({ id }) => id == sessionInfo.uid);
  res.status(200).json({ data: userInfo, isLogin: true });
});

app.post("/logout", async (req, res, next) => {
  try {
    let { sid } = req.cookies;
    if (!sid) {
      return res.status(200).json({ msg: "logout sussess", isLogin: false });
    }
    let sessionIndex = sessionDB.findIndex(({ id }) => id == sid);
    sessionDB.splice(sessionDB, 1);
    await fs.writeFile("./sessionDB.json", JSON.stringify(sessionDB, null, 2));
    res.status(200).json({ msg: "logout sussess", isLogin: false });
  } catch (error) {
    res.status(200).json({ msg: "logout Failed", isLogin: true });
  }
});

//Error Handleding
app.use((err, req, res, next) => {
  res.json({ msg: "something went wrong", err });
});

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
