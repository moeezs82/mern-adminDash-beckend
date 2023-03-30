const Product = require("../models/Product");
const ProductStat = require("../models/ProductStat");
const Transaction = require("../models/Transaction");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const getProducts = asyncHandler(async (req, res) => {
  // const products = await ProductStat.find()

  const products = await ProductStat.find()
    .populate("product")
    // .skip(0)
    // .limit(10)
    .lean()
    .select("-monthlyData -dailyData")
    .exec();

  // const productsWithStats = await Promise.all(
  //     products.map(async(product) => {
  //         const stat = await ProductStat.find({
  //             productId: product._id
  //         })
  //         return {
  //             ...product._doc,
  //             stat,
  //         }
  //     })
  // )

  res.status(200).json({
    success: true,
    products,
  });
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: "user" }).lean().exec();

  res.status(200).json({
    success: true,
    customers,
  });
});

const getTransactions = asyncHandler(async (req, res) => {
  //sort should be look like this: {"fieldname": "userId", "sort": "desc"}
  const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
  
  //checking if we are getting undefined sort
  let filteredSort = sort
  if (sort === undefined || sort === "undefined") {
    filteredSort = null
  }

  //formatted sort look like this: {userId: -1}
  const generateSort = () => {
    const sortParsed = JSON.parse(filteredSort);
    //checking if we are getting user then we have to sort via user email
    if (sortParsed.field === 'user') {
      sortParsed.field = 'email'
    }
    const sortFormatted = {
      [sortParsed.field]: (sortParsed.sort === "asc" ? 1 : -1),
    };

    return sortFormatted;
  };

  const sortFormatted = Boolean(filteredSort) ? generateSort() : {};

  //checking if sortFormatted has email then passing it to user
  let userFormatted = {}
  if (sortFormatted.hasOwnProperty("email")){
    userFormatted = sortFormatted
  }

  //getting users with search
  const users = await User.find({ email: { $regex: new RegExp(`.*${search}.*`, "i") } })
    .sort(userFormatted)
    .lean()
    .exec();

  //mapping users ids for search purpose
  const userIds = users.map((user) => user._id);

  // checking if formattedSort has email in it so not passing it to transactions
  let transFormatted = {}
  if (!sortFormatted.hasOwnProperty("email")){
    transFormatted = sortFormatted
  }

  const transactions = await Transaction.find({
    $or: [
      { cost: { $regex: new RegExp(search, "i") } },
      { user: { $in: userIds } },
    ],
  })
    .populate({
      path: "user",
      select: "email",
    })
    .sort(transFormatted)
    .skip(page * pageSize)
    .limit(pageSize)
    .exec();

  const total = await Transaction.countDocuments({
    $or: [
      { cost: { $regex: new RegExp(search, "i") } },
      { user: { $in: userIds } },
    ],
  });

  res.status(200).json({ success: true, transactions, total });
});

const getGeography = asyncHandler(async(req, res)=> {
  const users = User.find().lean().exec()
})

module.exports = {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
};
