class UsersController {
    
  async index(req, res) {
    res.send('Hello from UsersController');
  }
  
}

module.exports = new UsersController();