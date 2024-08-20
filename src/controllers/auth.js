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
    status: 201,
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

//=======================Reser email =================//

async function resetEmailController(req, res) {
  const emailToReset = req.body.email;

  await AuthService.resetEmail(emailToReset);
  res.send({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

async function resetPasswordController(req, res) {
  const { password, token } = req.body;

  await AuthService.resetPassword(password, token);

  res.send(200, {
    status: 200,
    message: 'Password reset has been successfully updated.',
    data: {},
  });
}

export {
  registerController,
  loginController,
  logoutUserController,
  refreshUserController,
  resetEmailController,
  resetPasswordController,
};
