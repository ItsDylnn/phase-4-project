const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5555;

// Enable CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Use default middlewares (CORS, static, etc)
server.use(middlewares);

// Body parser
server.use(jsonServer.bodyParser);

// Custom output with _id mapped to id
router.render = (req, res) => {
  const data = res.locals.data;
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item && item._id) {
        item.id = item._id;
        delete item._id;
      }
    });
  } else if (data && data._id) {
    data.id = data._id;
    delete data._id;
  }
  res.jsonp(data);
};

// Use the router
server.use(router);

// Start server
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API endpoints available at http://localhost:${port}`);
});
