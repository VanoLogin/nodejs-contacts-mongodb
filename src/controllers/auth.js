import * as AuthService from '../services/auth.js';

//======================registerController USER =================//

async function registerController(req, res) {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const createdNewUser = await AuthService.createNewUser(user);

  res.send({
    status: 200,
    message: 'Successfully registered a user!',
    data: createdNewUser,
  });
}

//======================loginController USER =================//

async function loginController(req, res) {
  const { email, password } = req.body;

  const session = await AuthService.loginUser(email, password);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in',
    data: {
      accessToken: session.accessToken,
    },
  });
}

//======================logoutUserController USER =================//

const logoutUserController = async (req, res) => {
  if (typeof req.cookies.sessionId === 'string') {
    await AuthService.logoutUser({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

//======================refreshUserController USER =================//

async function refreshUserController(req, res) {
  const session = await AuthService.refreshUser(
    req.cookies.sessionId,
    req.cookies.refreshToken,
  );

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export {
  registerController,
  loginController,
  logoutUserController,
  refreshUserController,
};
