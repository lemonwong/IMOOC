// 加载express模块和path模块
var express = require('express')
// 加载快速建模工具
var mongoose = require('mongoose')
// 加载模型文件
var Movie = require('./models/movie')
// 新字段替换老字段模块
var _ = require("underscore")
// 默认端口为3000，当然也可以命令行输入指定端口号：PORT=4000 node app.js
var port = process.env.PORT || 3000
// 加载解析模块，对post请求的请求体进行解析
var bodyParser = require('body-parser');
// 启动一个web服务器
var app = express()
// 连接本地的数据库
mongoose.connect('mongodb://localhost:27017/imooc', { useNewUrlParser: true })

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '1mb'}));

app.locals.moment=require('moment');

// 设置视图的根目录
app.set('views', './views/pages')
// 设置默认的模板引擎
app.set('view engine', 'jade')
// 引入时间插件
app.locals.moment = require('moment')
// 监听端口
app.listen(port)
// 打印日志
console.log('imooc started on port ' + port)
// express框架中的路由编写
// 首页
app.get('/', function(req, res) {
  // 获取数据里面所有的数据
  Movie.fetch(function(err, movies) {
    if(err) {
      console.log(err)
    }
    res.render('index', {
      title: '视频资源网首页',
      movies: movies
    })
  })
})
// 详情页
app.get('/movie/:id', function(req, res) {
  // url中的id
  var id = req.params.id
  // 查询特定的数据
  Movie.findById(id, function(err, movie) {
    res.render('detail', {
      title: '《' + movie.title + '》',
      movie: movie
    })
  })
})
// 更新数据页
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id
  if(id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: '数据已更新',
        movie: movie
      })
    })
  }
})
// 数据更新或者新增
app.post('/admin/movie/new', function(req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
  if(id !== 'undefined') {
    Movie.findById(id, function(err, movie) {
      if(err) {
        console.log(err)
      }
      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie) {
        if(err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
      })
    })
  } else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })
    _movie.save(function(err, movie) {
      if(err) {
        console.log(err)
      }
      res.redirect('/movie/' + movie._id)
    })
  }
})
// 后台管理页
app.get('/admin/movie', function(req, res) {
  res.render('admin', {
    title: '请录入视频~',
    movie: {
      title: "",
      doctor: "",
      country: "",
      year: "",
      poster: "",
      flash: "",
      summary: "",
      language: ""
    }
  })
})
// 列表页
app.get('/admin/list', function(req, res) {
  Movie.fetch(function(err, movies) {
    if(err) {
      console.log(err)
    }
    res.render('list', {
      title: '所有电影',
      movies: movies
    })
  })
})