import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { generateAuthUrl, loginWithGoogle } from "./services/loginWithGoogle.js";
const app = express();
const PORT = process.env.PORT || 3000;
import userDB from "./userDB.json" with { type: "json" };
import sessionDB from "./sessionDB.json" with { type: "json" };
import fs from "node:fs/promises";

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }),
);

app.get("/auth/google", (req, res) => {
  let googleAutherizationUrl = generateAuthUrl()
  // res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=openid email profile&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`,);
  res.redirect(googleAutherizationUrl);
});

app.get("/get-code", async (req, res) => {
  let code = req.query.code;

  let { sub, email, name, picture } = await loginWithGoogle(code);

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
    await fs.writeFile("./sessionDB.json", JSON.stringify(sessionDB, null, 2));
    return res.redirect(`http://127.0.0.1:5500/callback.html?sid=${id}`);
  }

  let createdUser = { id: sub, email, name, picture };
  userDB.push(createdUser);
  await fs.writeFile("./userDB.json", JSON.stringify(userDB, null, 2));

  let id = crypto.randomUUID();

  let createdSession = { id, uid: sub };
  sessionDB.push(createdSession);
  await fs.writeFile("./sessionDB.json", JSON.stringify(sessionDB, null, 2));


  res.redirect(`http://127.0.0.1:5500/callback.html?sid=${id}`);
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


app.get("/set-session-cookie", (req, res) => {
  let { sid } = req.query;
  res.cookie("sid", sid, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.end();
});

app.use((err, req, res, next) => {
  res.json({ msg: 'something went wrong' })
})


app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
