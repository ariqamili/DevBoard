const buildUserResponse = (user) => ({
  id: user._id,
  email: user.email,
  role: user.role,
});

module.exports = buildUserResponse;
