# forests
# 丛林小工具库

* makesql.js
- js版sql生成器

* db.js
- apicloud数据库操作工具  依赖 makesql.js

* syncdb.js
- apicloud数据库同步操作工具 依赖 makesql.js

* html5.js
- 网页版数据库操作工具 依赖 makesql.js

### html5
demo中的html5.html直接用chrome打开即可调试
```javascript
    //初始化数据库 以及全局数据库名称
    DBinit("test2", 1024 * 1024 * 4);
    //历史表
    var historyTabSql = 'CREATE TABLE "history" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"icon" TEXT,"url" TEXT,"title" TEXT,"time" INTEGER)';
    //书签
    var bookMarkTabSql = 'CREATE TABLE "book_mark" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"icon" TEXT,"url" TEXT,"title" TEXT,"time" INTEGER)';
    //首屏
    var coverTabSql = 'CREATE TABLE "cover" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"icon" TEXT,"url" TEXT,"title" TEXT,"time" INTEGER)';

    //删除表
    var dropHistory = "drop table history";
    var dropBookMark = "drop table book_mark";
    var dropCover = "drop table cover";

    //建表语句
    var tabSql = 'CREATE TABLE "cover" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"name" TEXT,"url" TEXT,"icon" TEXT,"num" INTEGER)';

    //创建数据库表
    DBquery(tabSql, function (ret) {
        console.log(ret);
    });
    //创建数据库表
    DBquery(bookMarkTabSql, function (ret) {
        console.log(ret);
    });
    //创建数据库表
    DBquery(historyTabSql, function (ret) {
        console.log(ret);
    });
    //查询所有数据库表
    DBShowTables(function (tablist) {
        console.log(tablist.rows);
    });
    //模糊查询某张表是否存在
    DBShowTables('cover', function (tablist) {
        console.log(tablist.rows);
    });


    //实例化单表model
    var bookarkModel = new H5DB("book_mark");
    //实例化cover表model
    var coverModel = new H5DB("cover");

    //添加一条数据
    bookarkModel.insert({
        icon: "mybdhome",
        url: "www.mybdhome.com",
        title: "icon",
        time: 1
    }, function (ret) {
        console.log(ret);
    });

    //删除一条数据
    bookarkModel.where('name', 1).delete(function (ret) {
        console.log(ret);
    });
    //模糊查找表名
    coverModel.showTables('co', function (ret) {
        console.log(ret);
    });

    //添加一条数据
    coverModel.insert({
        name: "mybdhome",
        url: "www.mybdhome.com",
        icon: "icon",
        num: 1
    }, function (ret) {
        console.log(ret);
    });

    /* 更新数据 */
    var sql = coverModel.where(function () {
        return "(`name` = 3 OR `id` = 6)";
    }).where("id", 1).orWhere("name", 2).update({
        "name": 1,
        "num": 26
    });

    //in 查询
    coverModel.where('name', 'in', ["mybdhome", 2, 3]).select(function(ret){

    })
    //not in  查询
    coverModel.where('name', 'not in', ["mybdhome", 2, 3]).select(function(ret){

    })

    //删除数据
    coverModel.where('id', 1).delete(function (ret) {
        console.log(ret);
    });

    //更新数据
    coverModel.where('id', 2).update({
        name: "mybdhome",
        url: "www.mybdhome.com",
        icon: "ddd",
        num: "5"
    }, function (ret) {
        console.log(ret);
    });

    //修改字段
    coverModel.where('id', 5).setField('name', 'nginx', function (ret) {
        console.log(ret);
    });

    //增加
    coverModel.where('id', 5).inc('num', 1, function (ret) {
        console.log(ret);
    });

    //减少
    coverModel.where('id', 6).dec('num', function (ret) {
        console.log(ret);
    });

    //求和
    coverModel.where('id', '<', 7).sum('num', function (ret) {
        console.log(ret);
    });

    //计数
    coverModel.where('id', '<', 7).count('num', function (ret) {
        console.log(ret);
    });

    //获取一定条目   分页查询
    coverModel.where('num', 1).start(2).num(2).select(function (ret) {
        console.log(ret);
    });

    //自定义where条件
    coverModel.where(function () {
        return "id = 2";
    }).select(function (ret) {
        console.log(ret);
    });

    //数组形式返回字段
    coverModel.pluck("name", function (res) {
        console.log(res);
    });

    //自定义where条件也支持链式操作
    var sql = coverModel.where(function () {
        return "id = 2";
    }).orWhere(function () {
        return "num = 1"
    }).order("num desc").order("id asc").order("name desc").num(1).select(function (ret) {
        console.log(ret);
    });
    //获取一列数据
    coverModel.where('id', 200).find(['name'], function (ret) {
        console.log(ret);
    });
    //获取某个字段的值
    coverModel.where('id', 30).getField('name', function (ret) {
        console.log(ret);
    });

    //获取该表全部数据
    coverModel.select(function (ret) {
        console.log(ret);
    });

    //模糊查找
    sql = coverModel.where('name','LIKE','%ngi%').select(function (ret) {
        console.log(ret);
    });

    console.log(sql);
```

### apicloud同步操作
```javascript
    //apicloud 控制台无法打印object对象  简单包装方便测试
    function p(o) {
        console.log(JSON.stringify(o));
    }
    apiready = function () {
        globalDB = api.require('db'); //引用db模块
        //初始化数据库
        DBinit('test');

        //建表语句
        var tabSql = 'CREATE TABLE "cover_test" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"title" TEXT,"url" TEXT,"icon" TEXT,"time" INTEGER)';
        //历史表
        var historyTabSql = 'CREATE TABLE "history" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"icon" TEXT,"url" TEXT,"title" TEXT,"time" INTEGER)';
        //书签
        var bookMarkTabSql = 'CREATE TABLE "book_mark" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"icon" TEXT,"url" TEXT,"title" TEXT,"time" INTEGER)';
        //首屏
        var coverTabSql = 'CREATE TABLE "cover_sync" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"icon" TEXT,"url" TEXT,"title" TEXT,"time" INTEGER)';

        //删除表
        var dropHistory = "drop table history";
        var dropBookMark = "drop table book_mark";
        var dropCover = "drop table cover_sync";
        var dropTabSql = "drop table cover_test";


//        p(DBquery('test', dropHistory));
//        p(DBquery('test', dropBookMark));
//        p(DBquery('test', dropCover));
//        p(DBquery('test', dropTabSql));

        //创建表
        p(DBquery('test', tabSql));
        p(DBquery('test', historyTabSql));
        p(DBquery('test', bookMarkTabSql));
        p(DBquery('test', coverTabSql));

        //实例化
        var db = new apiDB({
            tabname: "cover_test",
            dbname: "test"
        });

        //只传表名实例化
        var coveryncModel = new apiDB("cover_sync");

        //打印所有数据库
        p(DBShowTables());
        //模糊查找并打印
        console.log('模糊查找打印数据表');
        p(DBShowTables("cover"));
        console.log('打印所有数据库结束');

        //添加一条数据
        p(db.insert({
            title: "wangcong",
            url: "www.mybdhome.com",
            icon: "icon",
            time: 23
        }));
        //删除一条数据
        p(db.where('id', 1).delete());

        //更新数据
        p(db.where('id', 2).update({
            title: "wangcong1",
            url: "www.mybdhome.com",
            icon: "wangcong1",
            time: 23
        }));

        //设置一个字段
        p(db.where('id', 5).setField('title', '你是做啥的'));
        //增加
        p(db.where('id', 5).inc('time', 1));
        //减少
        p(db.where('id', 6).dec('time'));
        //求和
        p(db.where('id', '<', 7).sum('time'));
        //计数
        p(db.where('id', '<', 7).count('time'));
        //分页查询
        p(db.where('id','>', 1).start(2).num(2).select());
        //查询全部
        p(db.select());
        p('7号');
        //数组形式返回一列数据
        p(db.pluck("title"));
        //获取一个字段的值
        p(db.where("time",23).getField("title"));
        //查询一条数据
        p(db.where("time",23).find());
    };
```
### apicloud异步操作
```javascript
    //apicloud 控制台无法打印object对象  简单包装方便测试
    function p(o) {
        console.log(JSON.stringify(o));
    }

    apiready = function () {
        globalDB = api.require('db'); //引用db模块
        DBinit('test', function (ret) {
            //建表语句
            var tabSql = 'CREATE TABLE "cover" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"name" TEXT,"url" TEXT,"icon" TEXT,"num" INTEGER)';
            //历史表
            var historyTabSql = 'CREATE TABLE "history" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"icon" TEXT,"url" TEXT,"title" TEXT,"time" INTEGER)';

            //删除原有数据库
            var dropCover = "drop table cover";

            DBquery('test', dropCover, function (ret) {
                p(ret);
            });

            //创建数据库表
            DBquery('test', tabSql, function (ret) {
                //p(ret);
            });
            //创建数据库表
            DBquery('test', historyTabSql, function (ret) {
                //p(ret);
            });

            //实例化model
            var coverModel = new apiDB({
                tabname: "cover",
                dbname: "test"
            });

            //只传表名实例化model
            var historyModel = new apiDB("history");

            //查询所有数据库表
            DBShowTables(function (tablist) {
                console.log("打印所有数据库表");
                p(tablist);
            });
            //模糊查询某张表
            DBShowTables('cover', function (tablist) {
                console.log("打印数据库表");
                p(tablist);
            });

            //添加一条数据
            coverModel.insert({
                name: "wangcong",
                url: "www.mybdhome.com",
                icon: "icon",
                num: 1
            }, function (ret) {
                console.log('测试添加');
                p(ret);
            });

            //删除数据
            coverModel.where('id', 1).delete(function (ret) {
                p(ret);
            });

            //修改数据
            coverModel.where('id', 2).update({
                name: "wangcong1",
                url: "wangcong1",
                icon: "wangcong1",
                num: "5"
            }, function (ret) {
                p(ret);
            });

            //设置一个字段
            coverModel.where('id', 5).setField('name', 'nginx', function (ret) {
                p(ret);
            });

            //增加
            coverModel.where('id', 5).inc('num', 1, function (ret) {
                p(ret);
            });
            //减少
            coverModel.where('id', 6).dec('num', function (ret) {
                p(ret);
            });
            //求和
            coverModel.where('id', '<', 7).sum('num', function (ret) {
                p(ret);
            });
            //计数
            coverModel.where('id', '<', 7).count('num', function (ret) {
                p(ret);
            });
            //分页获取
            coverModel.where('num', 1).start(2).num(2).select(function (ret) {
                p(ret);
            });
            //获取全部数据
            coverModel.select(function (ret) {
                p(ret);
            });
            //字段列表
            coverModel.pluck('name', function (ret) {
                p(ret);
            });
        });
    };
```



项目中用到的一个db类操作封装，错误和疏漏在所难免，欢迎大家评论中指正！
另外该代码可以随意转载，修改以及重新发布，但需保留署名和github链接，谢谢！

欢迎访问www.mybdhome.com。

### PS:该库不断完善中，有bug联系QQ251957448
