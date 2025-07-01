const getAdminDashboard = (req, res) => {
  res.json({ message: 'Welcome, admin!' });
};

module.exports = {
  getAdminDashboard,
};
