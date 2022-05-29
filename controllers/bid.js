const BidService = require('../services/bid')

class BidController {
  static async getAllBids(req, res) {
    try {
      let bids = await BidService.findAll()
      bids.forEach(b => {
        b.bid_time = b.time_of_bid.toGMTString() 
      })
      res.render('bids', {bids})
    } catch (error) { 
      console.log(error)
      req.flash('error_msg', 'Error retrieving all bids')
      res.redirect('/')
    }
  }
}

module.exports = BidController